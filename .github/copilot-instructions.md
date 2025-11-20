# Copilot Instructions for WebApp-Register-System

## Project Overview - Google Apps Script Edition
Online Course Registration System สำหรับใช้งานบน **Google Apps Script** โดยสร้างเป็น **Web App ด้วย HTML + Tailwind CSS CDN + Alpine.js** โดยใช้เทคโนโลยี Google (Sheets, Drive, Slides, Gmail)

## Architecture & Data Flow

### Technology Stack
- **Frontend**: HTML + Alpine.js (reactive framework) + Tailwind CSS CDN (styling)
- **Backend**: Google Apps Script (GAS)
- **Database**: Google Sheets (Courses, Registrations, Users, FAQ, Announcements)
- **File Storage**: Google Drive (สำหรับไฟล์ที่อัปโหลดจากผู้ใช้)
- **Document Template**: Google Slides (สำหรับสร้าง PDF via docsToURI)
- **Email**: Gmail API (ส่งไฟล์ PDF + ข้อความยืนยัน)

### Project Structure
```
AppsScript Project (Google Drive)
├── Code.gs                 // ฟังก์ชันหลัก (doGet, API endpoints)
├── Database.gs            // Sheets API operations
├── FileManager.gs         // Google Drive operations
├── EmailService.gs        // Gmail operations + PDF generation
├── Utils.gs               // Helper functions
└── index.html             // Frontend HTML ที่มี Tailwind CDN + Alpine.js
    ├── <link href="https://cdn.tailwindcss.com" rel="stylesheet">
    ├── <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    └── Alpine.js components inline (x-data, x-show, @click, เป็นต้น)
```

### Google Sheets Database Schema

#### Sheet: "Courses"
| courseId | courseName | courseGen | description | startDate | endDate | registrationStart | registrationEnd | maxParticipants | currentParticipants | location | instructor | status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| C001 | การบริหารจัดการโรงพยาบาล | รุ่นที่ 15 | หลักสูตรพัฒนาทักษะ... | 2025-03-15 | 2025-03-20 | 2025-01-01 | 2025-08-28 | 50 | 35 | โรงแรมสยาม | ดร.สมชาย | active |

#### Sheet: "Registrations"
| registrationId | courseId | courseName | firstName | lastName | idCard | birthDate | phone | email | organization | position | address | registrationDate | status | uploadedFileId |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| R001 | C001 | การบริหารจัดการโรงพยาบาล | สมศักดิ์ | เจริญผล | 1-2345-... | 1985-05-15 | 081-234-5678 | somsak@... | โรงพยาบาลฯ | ผู้อำนวยการ | 123 ถนนฯ | 2025-01-15 | confirmed | file_id_xyz |

#### Sheet: "Users"
| userId | username | role | passwordHash | createdDate |
|---|---|---|---|---|
| U001 | admin | admin | hash_value | 2025-01-01 |

#### Sheet: "FAQ"
| id | question | answer |
|---|---|---|
| F001 | เนื้อหาคำถาม? | เนื้อหาคำตอบ... |

#### Sheet: "Announcements"
| id | title | content | postedDate | type |
|---|---|---|---|---|
| A001 | ประกาศสำคัญ | เนื้อหา... | 2025-01-15 | info |

### Frontend Architecture (HTML/JS)

#### Page Navigation (Alpine.js Data)
```html
<!-- index.html - Alpine.js app state -->
<div x-data="appData()" x-init="initApp()" :class="theme === 'dark' ? 'dark' : ''">
  <script>
    function appData() {
      return {
        currentPage: 'home', // 'home' | 'courses' | 'faq' | 'about' | 'admin'
        adminView: 'dashboard', // 'dashboard' | 'courses' | 'registrations' | 'cms'
        user: null,
        theme: localStorage.getItem('theme') || 'light', // 'light' | 'dark'
        courses: [],
        registrations: [],
        sidebarOpen: false,
        loading: false,
        showLoginModal: false,
        
        navigateTo(page) {
          this.currentPage = page;
          if (page !== 'admin') this.adminView = 'dashboard';
          this.sidebarOpen = false;
          this.loadPageData();
        },
        
        async loadPageData() {
          this.loading = true;
          try {
            if (this.currentPage === 'courses') {
              this.courses = await this.getCourses();
            }
          } catch (error) {
            this.showToast('เกิดข้อผิดพลาด: ' + error.message, 'error');
          } finally {
            this.loading = false;
          }
        },
        
        toggleTheme() {
          this.theme = this.theme === 'light' ? 'dark' : 'light';
          localStorage.setItem('theme', this.theme);
        }
      }
    }
  </script>
</div>
```

#### Component Structure (Alpine.js + Tailwind)
ทั้งหมดอยู่ใน **index.html** เดียว โดยใช้ Alpine.js directives:

- **Header** - `<div x-show="true" class="bg-white dark:bg-gray-900">` + `@click="toggleTheme()"`
- **Sidebar** - `<div :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'" class="fixed left-0 top-0 w-64 h-screen bg-white dark:bg-gray-800 transform transition-transform">`
- **Main Content** - `<div x-show="currentPage === 'home'" class="container mx-auto px-4 py-8">`
- **Course List** - `<template x-for="course in courses" :key="course.courseId">`
- **Forms** - `<form @submit.prevent="submitForm()" class="space-y-4">`
- **Modals** - `<div x-show="showLoginModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">`
- **Dark Mode** - `:class="theme === 'dark' ? 'dark' : ''"` ใน root element

#### Dark/Light Theme
```javascript
// Tailwind + Alpine.js dark mode
// สร้างใน Alpine.js appData()
toggleTheme() {
  this.theme = this.theme === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', this.theme);
  // Tailwind จะอัปเดต dark class อัตโนมัติ
}

// HTML
<div :class="theme === 'dark' ? 'dark' : ''">
  <!-- Tailwind จะใช้ dark: prefix classes -->
  <div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
</div>
```

### Google Apps Script Backend

#### doGet() - Main Entry Point
```javascript
// Code.gs
function doGet() {
  return HtmlService.createHtmlOutput(getIndexHtml())
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// Load index.html - Tailwind และ Alpine.js มาจาก CDN
function getIndexHtml() {
  return HtmlService.createHtmlTemplateFromFile('index.html').evaluate().getContent();
  // ไม่ต้องนำเข้า CSS หรือ JS เพิ่มเติม เพราะมาจาก CDN ในไฟล์ HTML เอง
}
```

#### API Endpoints (google.script.run)
```javascript
// Code.gs
// Called from frontend via google.script.run.getAllCourses()
function getAllCourses() {
  return DatabaseSheet.getCourses();
}

function registerForCourse(registrationData) {
  // Validate
  if (!registrationData.firstName || !registrationData.email) {
    throw new Error('กรุณากรอกข้อมูลที่จำเป็น');
  }
  
  // Save to Sheets
  const regId = DatabaseSheet.addRegistration(registrationData);
  
  // Upload file to Drive if present
  if (registrationData.fileBlob) {
    const fileId = FileManager.uploadFile(registrationData.fileBlob, regId);
    DatabaseSheet.updateRegistrationFile(regId, fileId);
  }
  
  // Send confirmation email with PDF
  EmailService.sendConfirmationEmail(registrationData, regId);
  
  return regId;
}

function loginUser(username, password) {
  const user = DatabaseSheet.findUser(username);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    throw new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
  }
  return user;
}

function logout() {
  // Frontend clears sessionStorage
}
```

### Database.gs - Sheets Operations
```javascript
// Database.gs
const DatabaseSheet = {
  // Get all courses
  getCourses: function() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Courses');
    const data = sheet.getDataRange().getValues();
    return this.rowsToObjects(data);
  },
  
  // Add registration
  addRegistration: function(regData) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Registrations');
    const regId = 'R' + Date.now();
    sheet.appendRow([
      regId,
      regData.courseId,
      regData.courseName,
      regData.firstName,
      regData.lastName,
      // ... other fields
    ]);
    return regId;
  },
  
  // Helper: convert rows to objects
  rowsToObjects: function(data) {
    const headers = data[0];
    return data.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });
  }
};
```

### FileManager.gs - Google Drive Operations
```javascript
// FileManager.gs
const FileManager = {
  // Upload file to Drive
  uploadFile: function(fileBlob, registrationId) {
    const folder = DriveApp.getFolderById('FOLDER_ID'); // ตั้งค่า folder ID
    const file = folder.createFile(fileBlob)
      .setName(`registration_${registrationId}_${new Date().getTime()}`);
    return file.getId();
  },
  
  // Download file
  getFileUrl: function(fileId) {
    const file = DriveApp.getFileById(fileId);
    return file.getDownloadUrl();
  },
  
  // Delete file
  deleteFile: function(fileId) {
    const file = DriveApp.getFileById(fileId);
    file.setTrashed(true);
  }
};
```

### EmailService.gs - Gmail + PDF Generation
```javascript
// EmailService.gs
const EmailService = {
  // Send confirmation with PDF
  sendConfirmationEmail: function(registrationData, registrationId) {
    const recipient = registrationData.email;
    const subject = `ยืนยันการลงทะเบียน: ${registrationData.courseName}`;
    
    // Generate PDF from Slides template
    const pdfBlob = this.generateCertificatePdf(registrationData);
    
    const body = `
สวัสดีค่ะ/ครับ ${registrationData.firstName} ${registrationData.lastName}

ขอบคุณที่ลงทะเบียนหลักสูตร: ${registrationData.courseName}

รหัสการลงทะเบียน: ${registrationId}
วันที่สมัคร: ${new Date().toLocaleDateString('th-TH')}
สถานะ: ยืนยัน

ไฟล์ใบสมัครแนบมาในอีเมลนี้

ขอแสดงความนับถือ
ทีมการศึกษา
    `;
    
    GmailApp.sendEmail(recipient, subject, body, {
      attachments: [pdfBlob]
    });
  },
  
  // Generate PDF from Slides
  generateCertificatePdf: function(registrationData) {
    const slideId = 'SLIDES_ID'; // ตั้งค่า template ID
    const slide = SlidesApp.openById(slideId);
    
    // Replace placeholders in slide
    this.replaceSlidePlaceholders(slide, {
      '{{NAME}}': registrationData.firstName + ' ' + registrationData.lastName,
      '{{COURSE}}': registrationData.courseName,
      '{{DATE}}': new Date().toLocaleDateString('th-TH')
    });
    
    // Convert to PDF
    const blob = SlidesApp.openById(slideId).getBlobs()[0]
      .getAs('application/pdf');
    return blob;
  },
  
  // Replace placeholders in Slides
  replaceSlidePlaceholders: function(slide, replacements) {
    const slides = slide.getSlides();
    slides.forEach(s => {
      const shapes = s.getShapes();
      shapes.forEach(shape => {
        let text = shape.getText().asString();
        Object.keys(replacements).forEach(placeholder => {
          text = text.replace(placeholder, replacements[placeholder]);
        });
        if (text !== shape.getText().asString()) {
          shape.getText().clear();
          shape.getText().appendText(text);
        }
      });
    });
  }
};
```

### Frontend API Communication (Alpine.js + google.script.run)

#### API Calls via google.script.run with Promises
```javascript
// index.html - API methods ใน appData()
const appData = () => ({
  // ... other properties
  
  // API wrapper - getCourses
  async getCourses() {
    return new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler(resolve)
        .withFailureHandler(reject)
        .getAllCourses();
    });
  },
  
  // API wrapper - submitRegistration
  async submitRegistration(formData) {
    return new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler(resolve)
        .withFailureHandler(reject)
        .registerForCourse(formData);
    });
  },
  
  // API wrapper - login
  async login(username, password) {
    return new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler(resolve)
        .withFailureHandler(reject)
        .loginUser(username, password);
    });
  },
  
  // Show toast notification
  showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `p-4 rounded ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`;
    toast.textContent = message;
    document.getElementById('toastContainer').appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
});
```

#### Form Submission Pattern
```html
<!-- index.html -->
<form @submit.prevent="handleRegistrationSubmit()" class="space-y-4">
  <input type="text" x-model="formData.firstName" placeholder="ชื่อ" required 
         class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded">
  
  <input type="email" x-model="formData.email" placeholder="อีเมล" required 
         class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded">
  
  <input type="file" @change="handleFileUpload($event)" accept="image/*,.pdf"
         class="w-full">
  
  <button type="submit" class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">
    ลงทะเบียน
  </button>
</form>

<script>
const appData = () => ({
  formData: {
    firstName: '',
    email: '',
    courseId: '',
    fileBlob: null,
    fileName: ''
  },
  
  handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.formData.fileBlob = e.target.result; // Base64
        this.formData.fileName = file.name;
      };
      reader.readAsArrayBuffer(file);
    }
  },
  
  async handleRegistrationSubmit() {
    try {
      this.loading = true;
      const regId = await this.submitRegistration(this.formData);
      this.showToast('ลงทะเบียนสำเร็จ! รหัส: ' + regId, 'success');
      this.formData = { firstName: '', email: '', courseId: '', fileBlob: null, fileName: '' };
      this.navigateTo('home');
    } catch (error) {
      this.showToast('เกิดข้อผิดพลาด: ' + error, 'error');
    } finally {
      this.loading = false;
    }
  }
});
</script>
```
  const fileBlob = fileInput.files[0] ? fileInput.files[0] : null;
  
  const registrationData = {
    courseId: formData.courseId,
    courseName: formData.courseName,
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    organization: formData.organization,
    position: formData.position,
    address: formData.address,
    fileBlob: fileBlob
  };
  
  google.script.run
    .withSuccessHandler(function(registrationId) {
      showToast('ลงทะเบียนสำเร็จ! รหัส: ' + registrationId, 'success');
      resetForm();
      navigateTo('home');
    })
    .withFailureHandler(function(error) {
      showToast('เกิดข้อผิดพลาด: ' + error, 'error');
    })
    .registerForCourse(registrationData);
}

function loginAdmin(username, password) {
  google.script.run
    .withSuccessHandler(function(user) {
      STATE.user = user;
      sessionStorage.setItem('user', JSON.stringify(user));
      navigateTo('admin');
      showToast('ล็อกอินสำเร็จ', 'success');
    })
    .withFailureHandler(function(error) {
      showToast('ล็อกอินผิดพลาด: ' + error, 'error');
    })
    .loginUser(username, password);
}
```

#### UI Rendering (ui.js)
```javascript
// js/ui.js
function renderPage() {
  const content = document.getElementById('content');
  content.innerHTML = '';
  
  switch(STATE.currentPage) {
    case 'home':
      content.innerHTML = getHomeViewHtml();
      break;
    case 'courses':
      content.innerHTML = getCoursesViewHtml();
      loadCourses();
      break;
    case 'admin':
      if (!STATE.user) {
        navigateTo('home');
        showLoginModal();
        return;
      }
      content.innerHTML = getAdminViewHtml();
      renderAdminView();
      break;
    // ... other pages
  }
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function showLoginModal() {
  const modal = document.getElementById('loginModal');
  modal.classList.add('open');
}
```

### Theme Implementation (CSS)

#### styles.css
```css
:root {
  --color-bg: #ffffff;
  --color-text: #333333;
  --color-border: #e0e0e0;
  --color-primary: #007bff;
  --color-success: #28a745;
  --color-error: #dc3545;
}

[data-theme="dark"] {
  --color-bg: #1a1a1a;
  --color-text: #f0f0f0;
  --color-border: #444444;
  --color-primary: #0056b3;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  transition: background-color 0.3s, color 0.3s;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.modal {
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
}
```

#### Responsive Design
```css
/* Mobile first */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    max-width: 250px;
    height: 100vh;
    transform: translateX(-100%);
    transition: transform 0.3s;
    z-index: 999;
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
  
  .container {
    padding: 1rem;
  }
}

@media (min-width: 769px) {
  .sidebar {
    position: fixed;
    width: 250px;
  }
  
  .main-content {
    margin-left: 250px;
  }
}
```

## Development Workflow

### Setup
1. สร้าง Google Apps Script project ใน Google Drive
2. สร้าง Google Sheets database กับ sheets ตามข้างต้น
3. สร้าง Google Slides template สำหรับใบสมัคร
4. ตั้งค่า folder ID ใน `FileManager.gs`
5. Deploy as web app: `Deploy > New deployment > Web app`

### Testing Locally
```javascript
// Code.gs - Test function
function doTest() {
  // Test database operations
  const courses = DatabaseSheet.getCourses();
  Logger.log('Courses: ' + JSON.stringify(courses));
  
  // Test API endpoints
  const result = getAllCourses();
  Logger.log(result);
}
```

### Deployment
```javascript
// Build script for Apps Script
// 1. Update version in Code.gs
// 2. Deploy: Deploy > Deploy new version
// 3. Set as "Execute as" your account
// 4. Share web app URL
```

## Project-Specific Patterns

### File Upload Handling
```javascript
// Frontend: HTML form
<input type="file" id="uploadFile" accept="image/*,.pdf">

// Backend: FileManager.gs handles the blob
```

### HTML Template Structure
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ระบบจัดทะเบียน</title>
  <link rel="stylesheet" href="css/styles.css">
  <link rel="stylesheet" href="css/responsive.css">
</head>
<body>
  <div id="app">
    <!-- Header -->
    <header id="header"></header>
    
    <!-- Sidebar -->
    <nav id="sidebar"></nav>
    
    <!-- Main Content -->
    <main id="content"></main>
    
    <!-- Footer -->
    <footer id="footer"></footer>
    
    <!-- Modals -->
    <div id="loginModal" class="modal"></div>
    <div id="registrationModal" class="modal"></div>
  </div>
  
  <script src="js/api.js"></script>
  <script src="js/ui.js"></script>
  <script src="js/theme.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

### Form Validation Pattern
```javascript
function validateRegistrationForm(data) {
  const errors = [];
  if (!data.firstName) errors.push('กรุณากรอกชื่อ');
  if (!data.lastName) errors.push('กรุณากรอกนามสกุล');
  if (!isValidEmail(data.email)) errors.push('อีเมลไม่ถูกต้อง');
  if (!isValidPhone(data.phone)) errors.push('เบอร์โทรศัพท์ไม่ถูกต้อง');
  
  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }
  return true;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[0-9]{10}$/.test(phone.replace(/[-\s]/g, ''));
}
```

### Authentication Pattern
```javascript
// Code.gs - password hashing
function hashPassword(password) {
  const salt = Utilities.getUuid();
  const hash = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256, 
    password + salt
  );
  return Utilities.base64Encode(hash) + ':' + salt;
}

function verifyPassword(password, hash) {
  const [storedHash, salt] = hash.split(':');
  const newHash = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    password + salt
  );
  return Utilities.base64Encode(newHash) === storedHash;
}

// Frontend - Login
function handleLogin(username, password) {
  google.script.run
    .withSuccessHandler(handleLoginSuccess)
    .withFailureHandler(handleLoginError)
    .loginUser(username, password);
}
```

## Common Development Tasks

### Adding a New Page
1. สร้าง HTML template
2. สร้าง function `get[PageName]ViewHtml()` ใน app.js
3. เพิ่ม case ใน `renderPage()` switch
4. เพิ่ม navigation ใน sidebar

### Adding Admin Feature
1. สร้าง HTML template สำหรับ admin feature
2. สร้าง function backend ใน Code.gs
3. สร้าง function frontend ใน api.js
4. เพิ่ม rendering logic ใน AdminDashboardView

### Adding Database Sheet
1. สร้าง sheet ใน Google Sheets
2. เพิ่ม methods ใน Database.gs
3. เรียกใช้จาก Code.gs

### Integration with Google APIs
```javascript
// Sheets
const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Name');

// Drive
const folder = DriveApp.getFolderById('FOLDER_ID');
const file = folder.createFile(blob);

// Slides
const slide = SlidesApp.openById('SLIDE_ID');

// Gmail
GmailApp.sendEmail(recipient, subject, body, { attachments: [blob] });
```

## Important Notes

### Quota & Limitations
1. **Execution time**: 6 นาทีต่อการเรียกใช้
2. **Drive quota**: ขึ้นอยู่กับ Google Account
3. **Sheet limits**: 10 million cells
4. **Email rate**: 100 封/วัน (อาจขึ้นอยู่กับ account type)

### Best Practices
- แคช Sheets data เพื่อลดการเรียก API
- ใช้ `withFailureHandler()` สำหรับจัดการข้อผิดพลาด
- ตรวจสอบไฟล์ขนาด ก่อนอัปโหลด
- ทดสอบ email delivery

### Security
- ไม่ต้องเก็บ password ในโค้ด (ตั้งค่าใน Sheets)
- ใช้ sessionStorage สำหรับ auth token บนfrontend
- ตรวจสอบสิทธิ์ user ในแต่ละ backend function
- ทำให้ web app accessible เฉพาะผู้ที่มีสิทธิ์



## Build & Development Workflow

### Project Structure in Google Apps Script
```
AppsScript Project
├── Code.gs                    // Main entry + API endpoints
├── Database.gs               // Sheets operations
├── FileManager.gs            // Drive operations
├── EmailService.gs           // Gmail + PDF generation
├── Utils.gs                  // Helpers
└── index.html               // HTML template
    ├── css/
    │   ├── styles.css       // Main styles + dark mode
    │   └── responsive.css   // Mobile responsive
    └── js/
        ├── app.js           // Main app state
        ├── api.js           // google.script.run calls
        ├── ui.js            // DOM rendering
        └── theme.js         // Theme toggle
```

### Running & Testing
1. ไปที่ Google Apps Script editor
2. กด **Run** button เพื่อทดสอบ `doGet()`
3. ดูผลลัพธ์ใน **Logs** (Ctrl+Enter)
4. Deploy as web app: **Deploy > New deployment > Web app**
5. Share URL กับผู้ใช้

### Local Development with clasp
```bash
# Install clasp
npm install -g @google/clasp

# Authenticate
clasp login

# Clone project
clasp clone PROJECT_ID

# Push code to Apps Script
clasp push

# Open in browser
clasp open
```

### Debugging
- ใช้ `Logger.log()` ใน GAS files
- ใช้ `console.log()` ใน HTML/JavaScript
- ดู Logs ด้วย **Execution Logs**
- ตรวจสอบ Network tab ใน DevTools สำหรับ google.script.run calls

## Project-Specific Patterns & Conventions

### HTML Structure
- Vanilla HTML, ไม่ใช้ JSX
- เก็บ HTML elements ใน `#app` container
- ใช้ `data-*` attributes สำหรับ element identification
- ใช้ semantic HTML (form, button, input)

### State Management (JavaScript)
```javascript
// app.js - Global state object
const STATE = {
  currentPage: 'home',
  adminView: 'dashboard',
  user: null,
  theme: localStorage.getItem('theme') || 'light',
  courses: [],
  registrations: [],
  sidebarOpen: false
};

// Never mutate STATE directly
// Use updateState() function
function updateState(updates) {
  Object.assign(STATE, updates);
  renderPage(); // Re-render after state change
}
```

### API Communication Pattern
```javascript
// api.js - Frontend calls backend via google.script.run
function loadCourses() {
  return new Promise((resolve, reject) => {
    google.script.run
      .withSuccessHandler(resolve)
      .withFailureHandler(reject)
      .getAllCourses();
  });
}

// Usage
loadCourses()
  .then(courses => {
    STATE.courses = courses;
    renderCoursesView();
  })
  .catch(error => showToast(error.message, 'error'));
```

### UI Rendering Pattern
```javascript
// ui.js - Render functions
function renderPage() {
  const content = document.getElementById('content');
  content.innerHTML = ''; // Clear
  
  switch(STATE.currentPage) {
    case 'home':
      content.appendChild(createHomeView());
      break;
    case 'courses':
      content.appendChild(createCoursesView());
      break;
    // ... other pages
  }
}

// Element factory pattern
function createCourseCard(course) {
  const card = document.createElement('div');
  card.className = 'course-card';
  card.innerHTML = `
    <h3>${course.courseName}</h3>
    <p>${course.instructor}</p>
    <button onclick="selectCourse('${course.courseId}')">ลงทะเบียน</button>
  `;
  return card;
}
```

### Styling
- ใช้ CSS custom properties สำหรับ theming
- ทั้งหมดอยู่ใน `css/styles.css` (ไม่มี separate component CSS)
- Dark mode ใช้ CSS selectors: `[data-theme="dark"]`
- Mobile-first responsive design

### Theme Implementation
```javascript
// theme.js
function toggleTheme() {
  const current = localStorage.getItem('theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  STATE.theme = next;
}
```

### Form Handling
```javascript
// HTML
<form id="registrationForm" onsubmit="handleRegistration(event)">
  <input type="text" name="firstName" required>
  <input type="email" name="email" required>
  <input type="file" name="uploadFile" accept="image/*,.pdf">
  <button type="submit">ลงทะเบียน</button>
</form>

// JavaScript
function handleRegistration(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const fileBlob = formData.get('uploadFile');
  
  const data = {
    firstName: formData.get('firstName'),
    email: formData.get('email'),
    fileBlob: fileBlob
  };
  
  google.script.run
    .withSuccessHandler(() => {
      showToast('ลงทะเบียนสำเร็จ', 'success');
      event.target.reset();
    })
    .withFailureHandler(error => showToast(error.message, 'error'))
    .registerForCourse(data);
}
```

### Modal Pattern
```javascript
// HTML
<div id="loginModal" class="modal">
  <div class="modal-content">
    <span class="close" onclick="closeModal('loginModal')">&times;</span>
    <h2>ล็อกอิน</h2>
    <form onsubmit="handleLogin(event)">
      <!-- form content -->
    </form>
  </div>
</div>

// JavaScript
function openModal(modalId) {
  document.getElementById(modalId).classList.add('open');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('open');
}
```

### Notification Toast
```javascript
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
```

### Google Apps Script Backend Patterns

#### API Endpoint Pattern
```javascript
// Code.gs
// ✅ ถูก: ทำการตรวจสอบและส่งข้อผิดพลาด
function getAllCourses() {
  try {
    return DatabaseSheet.getCourses();
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลหลักสูตร: ' + error.message);
  }
}

// ❌ ผิด: ส่งกลับ undefined หรือข้อมูลที่ไม่สม่ำเสมอ
function getCourseData() {
  const data = DatabaseSheet.getCourses();
  // ไม่มี error handling
}
```

#### Database Access Caching
```javascript
// ❌ ไม่ควร: ดึงข้อมูลทีละแถว
function getCourseById(courseId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Courses');
  for (let i = 2; i <= sheet.getLastRow(); i++) {
    if (sheet.getRange(i, 1).getValue() === courseId) {
      // ...
    }
  }
}

// ✅ ควร: ดึงทั้งหมดแล้วค้นหา
function getCourseById(courseId) {
  const courses = DatabaseSheet.getCourses();
  return courses.find(c => c.courseId === courseId);
}
```

### Thai Language Support
- ทุก string ตัวอักษรเป็นภาษาไทย UTF-8
- ใช้ moment.js หรือตัวเองสำหรับ date formatting ด้วยปีพุทธศักราช
- ชื่อไฟล์ที่อัปโหลดต้องรองรับภาษาไทย

## Common Development Tasks

### Adding a New Page/View
1. สร้าง function `create[PageName]View()` ใน `js/ui.js` ที่คืน DOM element
2. เพิ่ม case ใน `renderPage()` switch statement
3. เพิ่ม navigation link ใน sidebar
4. ถ้าต้อง API call ให้สร้าง function ใน `js/api.js`

### Adding an Admin Feature
1. สร้าง HTML template elements สำหรับ admin
2. เพิ่ม case ใน `renderAdminView()` for different admin views
3. สร้าง backend function ใน `Code.gs`
4. สร้าง frontend API wrapper ใน `js/api.js`
5. เรียกใช้ผ่าน `google.script.run`

### Adding a New Sheet to Database
1. สร้าง sheet ใน Google Sheets กับ headers
2. เพิ่ม methods ใน `Database.gs`
3. สร้าง API endpoints ใน `Code.gs`
4. เพิ่มการเรียก ใน views ผ่าน `js/api.js`

### File Upload Workflow
1. HTML input: `<input type="file" id="uploadFile">`
2. Get blob: `document.getElementById('uploadFile').files[0]`
3. ส่งไปยัง backend ผ่าน `google.script.run`
4. Backend (FileManager.gs): save to Google Drive
5. ติดตามไฟล์ ID ใน Registrations sheet

### Email with PDF Generation
1. ใน EmailService.gs: สร้าง function `generateCertificatePdf()`
2. เปิด Google Slides template ด้วย `SlidesApp.openById()`
3. แทนที่ placeholders ด้วยข้อมูล registration
4. Convert เป็น PDF ด้วย `getBlobs()[0].getAs('application/pdf')`
5. ส่งผ่าน Gmail ด้วย `GmailApp.sendEmail()` พร้อม attachments

### Styling New Components
- เพิ่มใน `css/styles.css`
- ใช้ CSS custom properties: `var(--color-primary)`
- ตรวจสอบ dark mode ด้วย `[data-theme="dark"] selector`
- ใช้ responsive breakpoints: 768px สำหรับ mobile/desktop

### Integrating Real Data from Sheets
```javascript
// Database.gs - Add new data retrieval method
const DatabaseSheet = {
  getNewData: function() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('SheetName');
    const data = sheet.getDataRange().getValues();
    return this.rowsToObjects(data);
  }
};

// Code.gs - Add API endpoint
function getNewData() {
  return DatabaseSheet.getNewData();
}

// js/api.js - Add frontend wrapper
function loadNewData() {
  return new Promise((resolve, reject) => {
    google.script.run
      .withSuccessHandler(resolve)
      .withFailureHandler(reject)
      .getNewData();
  });
}

// js/ui.js - Use in view
loadNewData()
  .then(data => {
    STATE.newData = data;
    renderView();
  })
  .catch(error => showToast(error.message, 'error'));
```

## Dependencies & External APIs
- **Google Sheets API** - ข้อมูลจัดเก็บ
- **Google Drive API** - ไฟล์อัปโหลด
- **Google Slides API** - PDF template
- **Gmail API** - ส่งอีเมล
- **HTML5** - Form, Canvas, File API
- **CSS3** - Flexbox, Grid, Animations
- **Vanilla JavaScript** - ES6+ (arrow functions, template literals, spread operator)

## Important Gotchas & Edge Cases
1. **File blob handling**: ต้องใช้ `base64` encoding เมื่อส่งไฟล์ผ่าน `google.script.run`
2. **Sheets API limit**: ไม่ต้องทำการแคชข้อมูลหลักสูตร (มีการอัปเดตบ่อย)
3. **Email quota**: Google Apps Script มีขีดจำกัด 100 อีเมลต่อวัน
4. **PDF generation**: Slides template ต้องประกอบไว้ ก่อนตั้งค่า ID
5. **Drive folder permission**: Folder ID ต้องมี write permission สำหรับ Apps Script
6. **Thai date formatting**: `new Date().toLocaleDateString('th-TH')` ได้ปีพุทธศักราช
7. **sessionStorage**: ข้อมูล user สูญหายเมื่อปิด browser tab (intentional สำหรับ security)
8. **Modal overlay**: ต้อง `event.stopPropagation()` เพื่อหลีกเลี่ยง unintended closes
