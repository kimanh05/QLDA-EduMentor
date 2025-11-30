/* =======================
   CLASS CARDS — DETAIL
   ======================= */
.class-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #e2ecff;
  box-shadow: 0 4px 14px rgba(15,35,52,0.08);
  margin-bottom: 16px;
}

.class-top-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.avatar-circle {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: #a6c9e2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: white;
}

.class-main {
  flex: 1;
}

.class-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--primary);
}

.class-subtitle {
  font-size: 14px;
  color: #4a5568;
  margin-bottom: 6px;
}

.class-info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px 14px;
  font-size: 13px;
  color: #4a5568;
}

.info-item {
  display: flex;
  gap: 6px;
  align-items: center;
}

.class-bottom-row {
  margin-top: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.phone-link {
  font-weight: 600;
  color: var(--accent);
}

/* =======================
   STATUS PILL
   ======================= */
.status-pill {
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.status-wait {
  background: var(--status-wait-bg);
  color: var(--status-wait-text);
}

.status-accepted {
  background: var(--status-green-bg);
  color: var(--status-green-text);
}

.status-rejected {
  background: var(--status-red-bg);
  color: var(--status-red-text);
}

.status-connected {
  background: var(--status-green-bg);
  color: var(--status-green-text);
}

/* =======================
   APPLICANT LIST
   ======================= */
.applicant-row {
  background: #f1f5ff;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.applicant-left {
  display: flex;
  gap: 10px;
  align-items: center;
}

.applicant-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #76a8d8;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
}

/* =======================
   PROFILE PAGE
   ======================= */
.profile-card {
  background: #fff;
  padding: 22px;
  border-radius: 16px;
  border: 1px solid #e2ecff;
  box-shadow: 0 4px 14px rgba(15,35,52,0.08);
  display: flex;
  gap: 20px;
}

.profile-avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: #0a4a7a;
}

.profile-main {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px 20px;
  font-size: 14px;
}

/* =======================
   MODAL (FIXED)
   ======================= */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: none;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.modal-backdrop.show {
  display: flex !important;
}

.modal {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 6px 30px rgba(0,0,0,0.3);
}

/* =======================
   MOBILE RESPONSIVE
   ======================= */
@media (max-width: 700px) {
  .class-info-grid {
    grid-template-columns: 1fr;
  }
  .profile-main {
    grid-template-columns: 1fr;
  }
  .class-bottom-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
/* ============================================
   LOCAL STORAGE KEYS
============================================ */
const USERS_KEY = "edm_users_v2";
const CURRENT_USER_KEY = "edm_current_user_v2";
const CLASSES_KEY = "edm_classes_v1";
const REQUESTS_KEY = "edm_requests_v1";

/* ============================================
   LOAD / SAVE HELPERS
============================================ */
function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loadCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY)) || null;
  } catch {
    return null;
  }
}

function saveCurrentUser(user) {
  if (user) localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(CURRENT_USER_KEY);
}

function loadClasses() {
  try {
    const raw = localStorage.getItem(CLASSES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}

  // Tạo dữ liệu mẫu khi chưa có
  const baseClasses = [
    {
      id: 1,
      parentUsername: "phuhuynh",
      parentName: "Đỗ Thị C",
      subject: "Vật lý",
      gradeText: "Học sinh lớp 11",
      address: "123 đường Đặng Thị Nhu",
      schedule: "Thứ hai 2PM - 4PM",
      fee: "3.000.000 VND",
      degreeReq: "Tốt nghiệp Đại học Sư phạm",
      genderReq: "Không yêu cầu",
      goal: "Cải thiện điểm",
    },
    {
      id: 2,
      parentUsername: "phuhuynh",
      parentName: "Đỗ Thị C",
      subject: "Toán",
      gradeText: "Học sinh lớp 10",
      address: "123 đường Đặng Thị Nhu",
      schedule: "Thứ hai 2PM - 4PM",
      fee: "30 USD",
      degreeReq: "Tốt nghiệp Đại học Sư phạm",
      genderReq: "Không yêu cầu",
      goal: "Củng cố kiến thức",
    },
    {
      id: 3,
      parentUsername: "phuhuynh",
      parentName: "Nguyễn Văn A",
      subject: "Hóa",
      gradeText: "Học sinh lớp 8",
      address: "XXX đường Đặng Thị Nhu",
      schedule: "Thứ hai 2PM - 4PM",
      fee: "2.000.000 VND",
      degreeReq: "Tốt nghiệp Đại học Sư phạm",
      genderReq: "Không yêu cầu",
      goal: "Cải thiện điểm",
    },
    {
      id: 4,
      parentUsername: "parent2",
      parentName: "Trần Thị B",
      subject: "Tiếng Anh",
      gradeText: "Học sinh lớp 9",
      address: "YYY đường Lê Lợi",
      schedule: "Thứ ba 7PM - 9PM",
      fee: "2.500.000 VND",
      degreeReq: "Sinh viên năm 3 trở lên",
      genderReq: "Nữ",
      goal: "Luyện giao tiếp",
    },
    {
      id: 5,
      parentUsername: "parent2",
      parentName: "Phạm Văn D",
      subject: "Toán",
      gradeText: "Học sinh lớp 6",
      address: "ZZZ đường 3/2",
      schedule: "Thứ bảy 8AM - 10AM",
      fee: "1.800.000 VND",
      degreeReq: "Sinh viên Sư phạm Toán",
      genderReq: "Không yêu cầu",
      goal: "Củng cố kiến thức nền",
    }
  ];

  localStorage.setItem(CLASSES_KEY, JSON.stringify(baseClasses));
  return baseClasses;
}

function saveClasses(classes) {
  localStorage.setItem(CLASSES_KEY, JSON.stringify(classes));
}

function loadRequests() {
  try {
    return JSON.parse(localStorage.getItem(REQUESTS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveRequests(reqs) {
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(reqs));
}

/* ============================================
   INITIAL DATA
============================================ */
let users = loadUsers();

// Nếu chưa có user, tạo 3 user mặc định
if (!users || users.length === 0) {
  users = [
    {
      username: "kimanh",
      password: "123456",
      firstName: "Kim Anh",
      lastName: "Nguyễn",
      email: "kimanh@example.com",
      phone: "0901234567",
      role: "gia-su",
    },
    {
      username: "thaongoc",
      password: "123456",
      firstName: "Thảo Ngọc",
      lastName: "Phạm",
      email: "thaongoc@example.com",
      phone: "0902345678",
      role: "gia-su",
    },
    {
      username: "phuhuynh",
      password: "123456",
      firstName: "Phương Tuấn",
      lastName: "Trịnh",
      email: "tuanparent@example.com",
      phone: "0912345678",
      role: "phu-huynh",
    },
  ];
  saveUsers(users);
}

let currentUser = loadCurrentUser();
let classes = loadClasses();
let requests = loadRequests();

/* ============================================
   AUTH UI UPDATE (Navbar)
============================================ */
const guestActions = document.getElementById("guest-actions");
const userActions = document.getElementById("user-actions");
const currentUserLabel = document.getElementById("current-user-label");
const logoutBtn = document.getElementById("logout-btn");

function roleToText(role) {
  if (role === "gia-su") return "Gia sư";
  if (role === "phu-huynh") return "Phụ huynh";
  if (role === "hoc-sinh") return "Học sinh";
  return "";
}

function updateAuthUI() {
  if (currentUser) {
    guestActions.classList.add("hidden");
    userActions.classList.remove("hidden");

    const fullName =
      ((currentUser.lastName || "") + " " + (currentUser.firstName || "")).trim() ||
      currentUser.username;

    currentUserLabel.textContent = fullName + " (" + roleToText(currentUser.role) + ")";
  } else {
    guestActions.classList.remove("hidden");
    userActions.classList.add("hidden");
  }

  renderAll();
}

/* ============================================
   LOGOUT
============================================ */
logoutBtn.addEventListener("click", () => {
  currentUser = null;
  saveCurrentUser(null);
  updateAuthUI();
  alert("Đã đăng xuất.");
});

/* ============================================
   REGISTER
============================================ */
document.getElementById("register-submit").addEventListener("click", () => {
  const lastName = document.getElementById("reg-lastname").value.trim();
  const firstName = document.getElementById("reg-firstname").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const phone = document.getElementById("reg-phone").value.trim();
  const username = document.getElementById("reg-username").value.trim();
  const password = document.getElementById("reg-password").value;
  const role = document.getElementById("reg-role").value;

  if (!username || !password || !lastName || !firstName) {
    alert("Vui lòng nhập đầy đủ Họ, Tên, Tài khoản và Mật khẩu.");
    return;
  }

  if (users.some(u => u.username === username)) {
    alert("Tên tài khoản đã tồn tại.");
    return;
  }

  const newUser = {
    username,
    password,
    firstName,
    lastName,
    email,
    phone,
    role,
  };

  users.push(newUser);
  saveUsers(users);

  alert("Đăng ký thành công! Hãy đăng nhập.");
  closeModal(registerModal);
  openModal(loginModal);
});

/* ============================================
   LOGIN FUNCTION
============================================ */
function tryLogin(username, password) {
  username = (username || "").trim();
  if (!username || !password) {
    alert("Vui lòng nhập đầy đủ thông tin.");
    return;
  }

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    alert("Sai tài khoản hoặc mật khẩu.");
    return;
  }

  currentUser = user;
  saveCurrentUser(user);
  closeModal(loginModal);
  updateAuthUI();
  alert("Đăng nhập thành công!");
}

document.getElementById("login-student-submit").addEventListener("click", () => {
  const u = document.getElementById("login-student-username").value.trim();
  const p = document.getElementById("login-student-password").value;
  tryLogin(u, p);
});

document.getElementById("login-tutor-submit").addEventListener("click", () => {
  const u = document.getElementById("login-tutor-username").value.trim();
  const p = document.getElementById("login-tutor-password").value;
  tryLogin(u, p);
});
/* ======================================================
   REQUEST STATUS CHECK (Gia sư → Lớp)
====================================================== */
function getRequestStatusForTutor(classId, tutorUsername) {
  const req = requests.find(
    (r) => r.classId === classId && r.tutor === tutorUsername
  );
  return req ? req.status : null;
}

/* ======================================================
   RENDER DANH SÁCH LỚP TẠI TRANG "DANH SÁCH LỚP"
====================================================== */
function renderClassesList() {
  const container = document.getElementById("classes-list");
  if (!container) return;

  let html = "";

  classes.forEach((c) => {
    const subtitle = `Cần gia sư môn ${c.subject} · ${c.gradeText}`;
    let actionHtml = "";
    const phone = "0123456XXX";

    /* ----------------------------
       Nếu user là Gia sư
       → Hiện status + nút đăng ký
    ----------------------------- */
    if (currentUser && currentUser.role === "gia-su") {
      const status = getRequestStatusForTutor(c.id, currentUser.username);

      if (!status) {
        actionHtml = `
          <button class="btn btn-primary btn-request" data-class-id="${c.id}">
            ĐĂNG KÍ NHẬN LỚP
          </button>
        `;
      } else if (status === "pending") {
        actionHtml = `<span class="status-pill status-wait">Đang chờ phụ huynh</span>`;
      } else if (status === "accepted") {
        actionHtml = `<span class="status-pill status-accepted">Được chọn · Chờ thanh toán</span>`;
      } else if (status === "rejected") {
        actionHtml = `<span class="status-pill status-rejected">Đã có gia sư khác</span>`;
      } else if (status === "paid") {
        actionHtml = `<span class="status-pill status-connected">Kết nối thành công</span>`;
      }

    } else {
      /* ----------------------------
         Nếu chưa login với vai trò gia sư
      ----------------------------- */
      actionHtml =
        '<span class="muted" style="font-size:12px;">Đăng nhập vai trò Gia sư để đăng kí lớp</span>';
    }

    /* ----------------------------
       HTML mỗi lớp
    ----------------------------- */
    html += `
      <div class="class-card">
        <div class="class-top-row">
          <div class="avatar-circle">${c.parentName[0]}</div>
          <div class="class-main">
            <div class="class-name">${c.parentName}</div>
            <div class="class-subtitle">${subtitle}</div>

            <div class="class-info-grid">
              <div class="info-item"><span>📍</span>${c.address}</div>
              <div class="info-item"><span>⏰</span>Thời gian: ${c.schedule}</div>
              <div class="info-item"><span>💰</span>Lương: ${c.fee}</div>
              <div class="info-item"><span>🎓</span>Bằng cấp: ${c.degreeReq}</div>
              <div class="info-item"><span>👥</span>Giới tính: ${c.genderReq}</div>
              <div class="info-item"><span>📚</span>Mục tiêu: ${c.goal}</div>
            </div>
          </div>
        </div>

        <div class="class-bottom-row">
          <span class="phone-link">${phone}</span>
          <div class="class-actions">${actionHtml}</div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  /* ======================================================
     Event: Gia sư nhấn "Đăng kí nhận lớp"
  ====================================================== */
  container.querySelectorAll(".btn-request").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!currentUser || currentUser.role !== "gia-su") {
        alert("Vui lòng đăng nhập với vai trò Gia sư.");
        return;
      }

      const classId = Number(btn.getAttribute("data-class-id"));

      if (
        requests.some(
          (r) => r.classId === classId && r.tutor === currentUser.username
        )
      ) {
        alert("Bạn đã đăng kí lớp này rồi.");
        return;
      }

      // Tạo yêu cầu pending
      requests.push({
        classId,
        tutor: currentUser.username,
        status: "pending",
      });

      saveRequests(requests);
      renderAll();

      alert("Đã gửi yêu cầu nhận lớp. Vui lòng chờ phụ huynh duyệt.");
    });
  });
}
/* ======================================================
   RENDER TRANG GIA SƯ
====================================================== */
function renderTutorSection() {
  const container = document.getElementById("tutor-section-content");
  if (!container) return;

  // Nếu không phải gia sư
  if (!currentUser || currentUser.role !== "gia-su") {
    container.innerHTML =
      '<p class="muted">Vui lòng đăng nhập với vai trò <b>Gia sư</b> để xem thông tin.</p>';
    return;
  }

  const fullName =
    ((currentUser.lastName || "") + " " + (currentUser.firstName || "")).trim() ||
    currentUser.username;

  const tutorRequests = requests.filter(
    (r) => r.tutor === currentUser.username
  );

  let classesHtml = "";

  tutorRequests.forEach((req) => {
    const c = classes.find((cl) => cl.id === req.classId);
    if (!c) return;

    const subtitle = `Cần gia sư môn ${c.subject} · ${c.gradeText}`;
    let statusClass = "status-wait";
    let statusText = "Đang chờ phụ huynh xác nhận";
    let extraActions = "";

    if (req.status === "accepted") {
      statusClass = "status-accepted";
      statusText =
        "Bạn đã được phụ huynh chọn. Vui lòng thanh toán phí nhận lớp.";

      extraActions = `
        <button class="btn btn-primary btn-xs"
          data-pay-class="${c.id}" data-pay-tutor="${currentUser.username}">
          Thanh toán phí nhận lớp
        </button>
      `;
    } else if (req.status === "rejected") {
      statusClass = "status-rejected";
      statusText = "Phụ huynh đã chọn gia sư khác.";
    } else if (req.status === "paid") {
      statusClass = "status-connected";
      statusText = "Kết nối lớp thành công 🎉";
    }

    classesHtml += `
      <div class="class-card">
        <div class="class-top-row">
          <div class="avatar-circle">${c.parentName[0]}</div>
          <div class="class-main">
            <div class="class-name">${c.parentName}</div>
            <div class="class-subtitle">${subtitle}</div>

            <div class="class-info-grid">
              <div class="info-item">📍 ${c.address}</div>
              <div class="info-item">⏰ ${c.schedule}</div>
              <div class="info-item">💰 ${c.fee}</div>
              <div class="info-item">🎓 ${c.degreeReq}</div>
              <div class="info-item">👥 ${c.genderReq}</div>
              <div class="info-item">📚 ${c.goal}</div>
            </div>
          </div>
        </div>

        <div class="class-bottom-row">
          <span class="phone-link">0123456XXX</span>

          <div class="class-actions">
            <span class="status-pill ${statusClass}">${statusText}</span>
            ${extraActions}
          </div>
        </div>
      </div>
    `;
  });

  if (!classesHtml) {
    classesHtml =
      '<p class="muted">Bạn chưa đăng ký lớp nào. Vào "Danh sách lớp" để đăng ký.</p>';
  }

  /* =============================
     Render giao diện hồ sơ gia sư
  ============================== */
  container.innerHTML = `
    <div class="profile-card">
      <div class="profile-avatar">
        <img src="https://images.pexels.com/photos/1181398/pexels-photo-1181398.jpeg?auto=compress&cs=tinysrgb&w=400" />
      </div>

      <div style="flex:1">
        <div class="profile-header">
          <div class="profile-name">${fullName}</div>
          <button class="btn btn-outline" id="open-edit-profile">⚙ Chỉnh sửa</button>
        </div>

        <div class="profile-main">
          <div><strong>Họ và tên:</strong> ${fullName}</div>
          <div><strong>Số điện thoại:</strong> ${currentUser.phone || "Chưa cập nhật"}</div>
          <div><strong>Email:</strong> ${currentUser.email || "Chưa cập nhật"}</div>
          <div><strong>Giới tính:</strong> Nam/Nữ</div>
          <div><strong>Học vấn:</strong> Tốt nghiệp Đại học Sư phạm</div>
          <div><strong>Môn dạy:</strong> Toán</div>
          <div><strong>Kinh nghiệm:</strong> 2 năm</div>
        </div>

        <span class="rating-badge">Đánh giá: 4.5 / 5</span>
      </div>
    </div>

    <h2 class="page-title" style="margin-top:10px;">CÁC LỚP ĐÃ ĐĂNG KÍ</h2>
    ${classesHtml}
  `;

  /* =============================
      Nút "Chỉnh sửa thông tin"
  ============================= */
  const editBtn = document.getElementById("open-edit-profile");
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      document.getElementById("edit-lastname").value = currentUser.lastName || "";
      document.getElementById("edit-firstname").value = currentUser.firstName || "";
      document.getElementById("edit-phone").value = currentUser.phone || "";
      document.getElementById("edit-email").value = currentUser.email || "";
      openModal(editProfileModal);
    });
  }

  /* =============================
      Nút "Thanh toán phí nhận lớp"
  ============================= */
  container.querySelectorAll("[data-pay-class]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const classId = Number(btn.getAttribute("data-pay-class"));
      const tutor = btn.getAttribute("data-pay-tutor");

      const cls = classes.find((c) => c.id === classId);

      paymentTarget = { classId, tutor };

      // Tính phí nhận lớp 25%
      const feeInfo = computeCommissionText(cls.fee);
      document.getElementById("payment-fee-text").textContent =
        "Phí nhận lớp: 25% tháng đầu = " + feeInfo;

      openModal(paymentModal);
    });
  });
}

let paymentTarget = null;
/* ======================================================
   RENDER TRANG "BÀI ĐĂNG PHỤ HUYNH"
====================================================== */
function renderParentPosts() {
  const container = document.getElementById("parent-posts-content");
  if (!container) return;

  // Chưa đăng nhập
  if (!currentUser) {
    container.innerHTML = `
      <p class="muted">Vui lòng đăng nhập vai trò <b>Phụ huynh</b> để xem danh sách bài đăng.</p>
    `;
    return;
  }

  if (currentUser.role !== "phu-huynh") {
    container.innerHTML = `
      <p class="muted">Bạn không phải phụ huynh. Chức năng này không khả dụng.</p>
    `;
    return;
  }

  const parentClasses = classes.filter(
    (c) => c.parentUsername === currentUser.username
  );

  if (parentClasses.length === 0) {
    container.innerHTML = `
      <p class="muted">Bạn chưa đăng lớp nào. Vào mục "Đăng bài" để đăng lớp.</p>
    `;
    return;
  }

  let html = "";

  parentClasses.forEach((cls) => {
    const reqs = requests.filter((r) => r.classId === cls.id);

    let applicantsHtml = "";

    if (reqs.length === 0) {
      applicantsHtml = `<p class="muted">Chưa có gia sư nào đăng ký lớp này.</p>`;
    } else {
      reqs.forEach((r) => {
        const tutor = users.find((u) => u.username === r.tutor);
        if (!tutor) return;

        const fullName =
          ((tutor.lastName || "") + " " + (tutor.firstName || "")).trim() ||
          tutor.username;

        let statusText = "";
        let actionHtml = "";

        if (r.status === "pending") {
          statusText = `<span class="status-pill status-wait">Chờ bạn duyệt</span>`;
          actionHtml = `
            <button class="btn btn-primary btn-xs btn-accept"
              data-class-id="${cls.id}" data-tutor="${tutor.username}">
              Chấp nhận
            </button>
            <button class="btn btn-outline btn-xs btn-reject"
              data-class-id="${cls.id}" data-tutor="${tutor.username}">
              Từ chối
            </button>
          `;
        } else if (r.status === "accepted") {
          statusText = `<span class="status-pill status-accepted">Đã chấp nhận – Chờ thanh toán</span>`;
        } else if (r.status === "rejected") {
          statusText = `<span class="status-pill status-rejected">Đã từ chối</span>`;
        } else if (r.status === "paid") {
          statusText = `<span class="status-pill status-connected">Kết nối thành công</span>`;
        }

        applicantsHtml += `
          <div class="applicant-row">
            <div class="applicant-left">
              <div class="applicant-avatar">${fullName[0]}</div>
              <div>
                <div><b>${fullName}</b></div>
                <div class="muted">${tutor.email || ""}</div>
              </div>
            </div>

            <div class="applicant-actions">
              ${statusText}
              ${actionHtml}
            </div>
          </div>
        `;
      });
    }

    html += `
      <div class="parent-post-card">
        <div class="parent-post-title">${cls.subject} – ${cls.gradeText}</div>
        <div class="parent-post-info">📍 ${cls.address}</div>
        <div class="parent-post-info">⏰ ${cls.schedule}</div>
        <div class="parent-post-info">💰 ${cls.fee}</div>

        <h4 style="margin-top: 14px;">Danh sách gia sư đăng ký</h4>
        ${applicantsHtml}
      </div>
    `;
  });

  container.innerHTML = html;

  /* ======================================================
     BUTTON — ACCEPT
  ====================================================== */
  container.querySelectorAll(".btn-accept").forEach((btn) => {
    btn.addEventListener("click", () => {
      const classId = Number(btn.getAttribute("data-class-id"));
      const tutorName = btn.getAttribute("data-tutor");

      requests.forEach((r) => {
        if (r.classId === classId) {
          if (r.tutor === tutorName) r.status = "accepted";
          else if (r.status !== "paid") r.status = "rejected"; // từ chối tự động các tutor khác
        }
      });

      saveRequests(requests);
      renderAll();
      alert("Bạn đã chấp nhận gia sư này!");
    });
  });

  /* ======================================================
     BUTTON — REJECT
  ====================================================== */
  container.querySelectorAll(".btn-reject").forEach((btn) => {
    btn.addEventListener("click", () => {
      const classId = Number(btn.getAttribute("data-class-id"));
      const tutorName = btn.getAttribute("data-tutor");

      const req = requests.find(
        (r) => r.classId === classId && r.tutor === tutorName
      );

      if (req) {
        req.status = "rejected";
        saveRequests(requests);
        renderAll();
        alert("Đã từ chối gia sư.");
      }
    });
  });
}
/* ======================================================
   CREATE POST (PHỤ HUYNH ĐĂNG LỚP)
====================================================== */
document.getElementById("create-post-submit").addEventListener("click", () => {
  if (!currentUser || currentUser.role !== "phu-huynh") {
    alert("Bạn phải đăng nhập vai trò Phụ huynh để đăng bài.");
    return;
  }

  const subject = document.getElementById("cp-subject").value.trim();
  const gradeText = document.getElementById("cp-grade").value.trim();
  const address = document.getElementById("cp-address").value.trim();
  const schedule = document.getElementById("cp-schedule").value.trim();
  const fee = document.getElementById("cp-fee").value.trim();
  const degreeReq = document.getElementById("cp-degree").value.trim();
  const genderReq = document.getElementById("cp-gender").value.trim();
  const goal = document.getElementById("cp-goal").value.trim();

  if (!subject || !gradeText || !address || !schedule || !fee) {
    alert("Vui lòng nhập đầy đủ thông tin bắt buộc.");
    return;
  }

  const newClass = {
    id: Date.now(),
    parentUsername: currentUser.username,
    parentName: currentUser.lastName + " " + currentUser.firstName,
    subject,
    gradeText,
    address,
    schedule,
    fee,
    degreeReq,
    genderReq,
    goal,
  };

  classes.push(newClass);
  saveClasses(classes);

  alert("Đăng lớp thành công!");
  renderAll();
});

/* ======================================================
   EDIT PROFILE (GIA SƯ)
====================================================== */
document.getElementById("edit-profile-submit").addEventListener("click", () => {
  const ln = document.getElementById("edit-lastname").value.trim();
  const fn = document.getElementById("edit-firstname").value.trim();
  const phone = document.getElementById("edit-phone").value.trim();
  const email = document.getElementById("edit-email").value.trim();

  if (!ln || !fn) {
    alert("Vui lòng nhập Họ và Tên.");
    return;
  }

  currentUser.lastName = ln;
  currentUser.firstName = fn;
  currentUser.phone = phone;
  currentUser.email = email;

  // update users list
  const idx = users.findIndex((u) => u.username === currentUser.username);
  if (idx >= 0) users[idx] = currentUser;

  saveUsers(users);
  saveCurrentUser(currentUser);

  closeModal(editProfileModal);
  renderAll();

  alert("Đã lưu thông tin!");
});

/* ======================================================
   PAYMENT CONFIRM (QR)
====================================================== */
function computeCommissionText(feeStr) {
  const num = parseInt(feeStr.replace(/[^0-9]/g, ""));
  if (!num) return feeStr + " × 25% (không tính được)";
  return (num * 0.25).toLocaleString("vi-VN") + " VND";
}

document.getElementById("payment-confirm-btn").addEventListener("click", () => {
  if (!paymentTarget) {
    alert("Lỗi: không tìm thấy lớp cần thanh toán.");
    return;
  }

  const { classId, tutor } = paymentTarget;

  const req = requests.find(
    (r) => r.classId === classId && r.tutor === tutor
  );

  if (!req) {
    alert("Không tìm thấy yêu cầu nhận lớp.");
    return;
  }

  req.status = "paid";
  saveRequests(requests);

  closeModal(paymentModal);

  alert("Thanh toán thành công! Bạn đã kết nối lớp.");
  renderAll();
});

/* ======================================================
   RENDER ALL (GỌI LẠI TOÀN BỘ)
====================================================== */
function renderAll() {
  renderClassesList();
  renderTutorSection();
  renderParentPosts();
}

/* ======================================================
   INITIAL LOAD
====================================================== */
document.addEventListener("DOMContentLoaded", () => {
  updateAuthUI();
  showSection("home-section");
});
