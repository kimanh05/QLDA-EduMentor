// assets/js/app.js
// ========================================
//  EduMentor DEMO - FRONTEND + LOCALSTORAGE
//  Không cần backend, chạy hoàn toàn trên trình duyệt
// ========================================

const LS_KEY = "edm_state_v1";

// ---------------------- STATE ----------------------
let state = {
  users: [],
  posts: [],
  applications: [],
  currentUserId: null,
  currentPaymentAppId: null,
};

// ---------------------- HELPERS ----------------------
function saveState() {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}

function loadState() {
  const raw = localStorage.getItem(LS_KEY);
  if (raw) {
    try {
      state = JSON.parse(raw);
    } catch (e) {
      console.error("Parse state error", e);
    }
  }
}

function uid() {
  return (
    Date.now().toString(36) + Math.random().toString(36).substring(2, 8)
  );
}

function getCurrentUser() {
  return state.users.find((u) => u.id === state.currentUserId) || null;
}

function roleLabel(role) {
  switch (role) {
    case "gia-su":
      return "Gia sư";
    case "hoc-sinh":
      return "Học sinh";
    case "phu-huynh":
      return "Phụ huynh";
    default:
      return "";
  }
}

// Seed demo users + posts cho đẹp
function seedDemoDataIfEmpty() {
  if (state.users.length > 0 || state.posts.length > 0) return;

  const parentId = uid();
  const tutorId = uid();

  state.users.push(
    {
      id: parentId,
      username: "phuhuynh1",
      password: "123456",
      role: "phu-huynh",
      firstName: "Anh",
      lastName: "Nguyễn",
      phone: "0901 234 567",
      email: "parent1@example.com",
      edu: "",
      exp: "",
      subject: "",
      gender: "Nữ",
    },
    {
      id: tutorId,
      username: "giasu1",
      password: "123456",
      role: "gia-su",
      firstName: "Ngọc",
      lastName: "Phạm",
      phone: "0902 345 678",
      email: "tutor1@example.com",
      edu: "SV Đại học Bách khoa",
      exp: "1 năm dạy kèm Toán - Lý",
      subject: "Toán, Lý",
      gender: "Nữ",
    }
  );

  const post1 = {
    id: uid(),
    title: "Cần gia sư Toán 9 luyện thi vào 10",
    subject: "Toán",
    grade: "Lớp 9",
    location: "Quận 10, TP.HCM",
    schedule: "3 buổi/tuần (T2, T4, T6)",
    fee: "2.000.000đ/tháng",
    requirements: "Ưu tiên SV Bách khoa, có kinh nghiệm ôn thi 10",
    contactName: "Phụ huynh A",
    contactPhone: "0901 234 567",
    createdByUserId: parentId,
    createdAt: Date.now(),
  };

  const post2 = {
    id: uid(),
    title: "Gia sư Tiếng Anh giao tiếp cho sinh viên",
    subject: "Tiếng Anh",
    grade: "Đại học",
    location: "Online (Google Meet)",
    schedule: "2 buổi/tuần (tối T3, T5)",
    fee: "150.000đ/buổi",
    requirements: "IELTS ≥ 7.0, nói tốt",
    contactName: "Phụ huynh B",
    contactPhone: "0909 999 999",
    createdByUserId: parentId,
    createdAt: Date.now() - 100000,
  };

  state.posts.push(post1, post2);
  saveState();
}

// ---------------------- MODAL CONTROL ----------------------
function showModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove("hidden");
  el.classList.add("show");
}

function hideModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add("hidden");
  el.classList.remove("show");
}

// ---------------------- RENDER FUNCTIONS ----------------------
function renderNavbarUserState() {
  const guestActions = document.getElementById("guest-actions");
  const userActions = document.getElementById("user-actions");
  const label = document.getElementById("current-user-label");

  const user = getCurrentUser();

  if (!guestActions || !userActions || !label) return;

  if (!user) {
    guestActions.classList.remove("hidden");
    userActions.classList.add("hidden");
    label.textContent = "";
  } else {
    guestActions.classList.add("hidden");
    userActions.classList.remove("hidden");
    const fullName = `${user.lastName || ""} ${user.firstName || ""}`.trim();
    label.textContent = `${roleLabel(user.role)} - ${fullName || user.username}`;
  }
}

function renderClassesList() {
  const container = document.getElementById("classes-list");
  if (!container) return;
  container.innerHTML = "";

  if (state.posts.length === 0) {
    container.innerHTML =
      '<p class="muted">Hiện chưa có bài đăng nào. Phụ huynh/Học sinh có thể đăng bài ở mục "Đăng bài tìm gia sư".</p>';
    return;
  }

  const currentUser = getCurrentUser();

  const postsSorted = [...state.posts].sort(
    (a, b) => b.createdAt - a.createdAt
  );

  postsSorted.forEach((post) => {
    const card = document.createElement("div");
    card.className = "class-card";

    let myApp = null;
    if (currentUser && currentUser.role === "gia-su") {
      myApp = state.applications.find(
        (a) => a.postId === post.id && a.tutorId === currentUser.id
      );
    }

    let statusHtml = "";
    let actionHtml = "";

    if (currentUser && currentUser.role === "gia-su") {
      if (!myApp) {
        statusHtml =
          '<span class="status-pill status-wait">Chưa đăng ký</span>';
        actionHtml =
          '<button class="btn btn-primary btn-xs class-apply-btn" data-post-id="' +
          post.id +
          '">Đăng ký nhận lớp</button>';
      } else {
        let statusClass = "status-wait";
        let statusText = "Chờ phụ huynh duyệt";

        if (myApp.status === "chap-nhan" && !myApp.paymentConfirmed) {
          statusClass = "status-accepted";
          statusText = "Đã được chấp nhận - chờ thanh toán";
          actionHtml =
            '<button class="btn btn-primary btn-xs open-payment-btn" data-app-id="' +
            myApp.id +
            '">Thanh toán phí</button>';
        } else if (myApp.status === "tu-choi") {
          statusClass = "status-rejected";
          statusText = "Đã bị từ chối";
        } else if (myApp.status === "da-ket-noi") {
          statusClass = "status-connected";
          statusText = "Đã kết nối - liên hệ phụ huynh";
        }

        statusHtml =
          '<span class="status-pill ' +
          statusClass +
          '">' +
          statusText +
          "</span>";
      }
    } else {
      // Không phải gia sư
      const appsCount = state.applications.filter(
        (a) => a.postId === post.id
      ).length;
      statusHtml =
        '<span class="status-pill status-wait">Đã có ' +
        appsCount +
        " lượt gia sư đăng ký</span>";
      actionHtml =
        '<span class="muted" style="font-size:12px;">Đăng nhập với vai trò Gia sư để đăng ký nhận lớp.</span>';
    }

    card.innerHTML = `
      <div class="class-top-row">
        <div class="avatar-circle">${post.subject
          .substring(0, 1)
          .toUpperCase()}</div>
        <div class="class-main">
          <div class="class-name">${post.title}</div>
          <div class="class-subtitle">${post.subject} · ${post.grade}</div>

          <div class="class-info-grid">
            <div class="info-item">📍 ${post.location}</div>
            <div class="info-item">⏱ ${post.schedule}</div>
            <div class="info-item">💰 ${post.fee}</div>
            <div class="info-item">👤 Liên hệ: ${post.contactName}</div>
            <div class="info-item">📞 ${post.contactPhone}</div>
          </div>

          <div style="margin-top:8px; font-size:13px; color:#4a5568;">
            <b>Yêu cầu:</b> ${post.requirements || "Không có"}
          </div>
        </div>
      </div>

      <div class="class-bottom-row">
        <div>${statusHtml}</div>
        <div>${actionHtml}</div>
      </div>
    `;

    container.appendChild(card);
  });
}

function renderCreatePostSection() {
  const container = document.getElementById("create-post-content");
  if (!container) return;

  const currentUser = getCurrentUser();
  if (!currentUser || (currentUser.role !== "phu-huynh" && currentUser.role !== "hoc-sinh")) {
    container.innerHTML =
      '<p class="muted">Vui lòng đăng nhập với vai trò <b>Phụ huynh/Học sinh</b> để đăng bài tìm gia sư.</p>';
    return;
  }

  container.innerHTML = `
    <p class="muted" style="margin-bottom:10px;">
      Điền thông tin lớp học cần tìm gia sư. Dữ liệu được lưu demo trong trình duyệt (LocalStorage).
    </p>

    <div class="form-group">
      <label>Tiêu đề bài đăng *</label>
      <input id="post-title" class="input" placeholder="VD: Cần gia sư Toán 9 luyện thi vào 10" />
    </div>

    <div class="form-group">
      <label>Môn học *</label>
      <input id="post-subject" class="input" placeholder="Toán, Lý, Hóa, Tiếng Anh..." />
    </div>

    <div class="form-group">
      <label>Lớp / Trình độ *</label>
      <input id="post-grade" class="input" placeholder="VD: Lớp 9, Lớp 12, Đại học..." />
    </div>

    <div class="form-group">
      <label>Khu vực / Hình thức học *</label>
      <input id="post-location" class="input" placeholder="VD: Quận 10, TP.HCM hoặc Online" />
    </div>

    <div class="form-group">
      <label>Lịch học dự kiến *</label>
      <input id="post-schedule" class="input" placeholder="VD: 3 buổi/tuần (T2, T4, T6)" />
    </div>

    <div class="form-group">
      <label>Học phí dự kiến *</label>
      <input id="post-fee" class="input" placeholder="VD: 2.000.000đ/tháng" />
    </div>

    <div class="form-group">
      <label>Yêu cầu chi tiết</label>
      <textarea id="post-req" class="input" rows="3" placeholder="Ưu tiên sinh viên trường nào, yêu cầu kinh nghiệm..."></textarea>
    </div>

    <div class="form-group">
      <label>Số điện thoại liên hệ *</label>
      <input id="post-phone" class="input" value="${currentUser.phone || ""}" />
    </div>

    <button id="create-post-submit" class="btn btn-primary" style="margin-top:8px;">
      📢 Đăng bài tìm gia sư
    </button>
  `;
}

function renderParentPosts() {
  const container = document.getElementById("parent-posts-content");
  if (!container) return;

  const currentUser = getCurrentUser();
  if (!currentUser || (currentUser.role !== "phu-huynh" && currentUser.role !== "hoc-sinh")) {
    container.innerHTML =
      '<p class="muted">Vui lòng đăng nhập với vai trò <b>Phụ huynh/Học sinh</b> để xem và duyệt các bài đăng của bạn.</p>';
    return;
  }

  const myPosts = state.posts.filter(
    (p) => p.createdByUserId === currentUser.id
  );

  if (myPosts.length === 0) {
    container.innerHTML =
      '<p class="muted">Bạn chưa có bài đăng nào. Hãy vào mục "Đăng bài tìm gia sư" để tạo mới.</p>';
    return;
  }

  container.innerHTML = "";

  myPosts.forEach((post) => {
    const postEl = document.createElement("div");
    postEl.className = "parent-post-card";

    const apps = state.applications.filter((a) => a.postId === post.id);

    let appsHtml = "";
    if (apps.length === 0) {
      appsHtml =
        '<p class="muted" style="margin-top:6px;">Chưa có gia sư nào đăng ký nhận lớp này.</p>';
    } else {
      appsHtml = apps
        .map((app) => {
          const tutor = state.users.find((u) => u.id === app.tutorId);
          const tutorName = tutor
            ? `${tutor.lastName || ""} ${tutor.firstName || ""}`.trim() ||
              tutor.username
            : "Gia sư";

          let statusClass = "status-wait";
          let statusText = "Chờ bạn duyệt";

          if (app.status === "chap-nhan" && !app.paymentConfirmed) {
            statusClass = "status-accepted";
            statusText = "Đã chấp nhận - chờ gia sư thanh toán";
          } else if (app.status === "tu-choi") {
            statusClass = "status-rejected";
            statusText = "Đã từ chối";
          } else if (app.status === "da-ket-noi") {
            statusClass = "status-connected";
            statusText = "Đã kết nối, gia sư đã thanh toán";
          }

          let actionHtml = "";
          if (app.status === "cho-duyet") {
            actionHtml = `
              <button class="btn btn-primary btn-xs parent-accept-btn" data-app-id="${app.id}">
                Chấp nhận
              </button>
              <button class="btn btn-outline btn-xs parent-reject-btn" data-app-id="${app.id}">
                Từ chối
              </button>
            `;
          }

          return `
            <div class="applicant-row">
              <div class="applicant-left">
                <div class="applicant-avatar">${tutorName
                  .substring(0, 1)
                  .toUpperCase()}</div>
                <div style="font-size:13px;">
                  <div><b>${tutorName}</b> (${tutor ? tutor.subject || "Gia sư" : ""
            })</div>
                  <div style="font-size:12px;">📞 ${
                    tutor ? tutor.phone || "Chưa cập nhật" : "Chưa cập nhật"
                  }</div>
                </div>
              </div>
              <div style="text-align:right; font-size:12px;">
                <div class="status-pill ${statusClass}" style="display:inline-block; margin-bottom:4px;">
                  ${statusText}
                </div>
                <div>${actionHtml}</div>
              </div>
            </div>
          `;
        })
        .join("");
    }

    postEl.innerHTML = `
      <div class="parent-post-title">${post.title}</div>
      <div class="parent-post-info">
        <b>Môn:</b> ${post.subject} · <b>Lớp:</b> ${post.grade} · <b>Khu vực:</b> ${
      post.location
    }
      </div>
      <div class="parent-post-info">
        <b>Lịch học:</b> ${post.schedule} · <b>Học phí:</b> ${post.fee}
      </div>
      <div class="parent-post-info">
        <b>Yêu cầu:</b> ${post.requirements || "Không có"}
      </div>
      <div style="margin-top:10px; font-size:13px; font-weight:600;">
        Gia sư đã đăng ký:
      </div>
      ${appsHtml}
    `;
    container.appendChild(postEl);
  });
}

function renderTutorSection() {
  const container = document.getElementById("tutor-section-content");
  if (!container) return;

  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== "gia-su") {
    container.innerHTML =
      '<p class="muted">Vui lòng đăng nhập với vai trò <b>Gia sư</b> để xem hồ sơ và các lớp đã đăng ký.</p>';
    return;
  }

  const apps = state.applications.filter((a) => a.tutorId === currentUser.id);

  const profileHtml = `
    <div class="profile-card">
      <div class="profile-avatar"></div>
      <div class="profile-main">
        <div><b>Họ tên:</b> ${currentUser.lastName || ""} ${
    currentUser.firstName || ""
  }</div>
        <div><b>Tài khoản:</b> ${currentUser.username}</div>
        <div><b>Số điện thoại:</b> ${currentUser.phone || "Chưa cập nhật"}</div>
        <div><b>Email:</b> ${currentUser.email || "Chưa cập nhật"}</div>
        <div><b>Học vấn:</b> ${currentUser.edu || "Chưa cập nhật"}</div>
        <div><b>Kinh nghiệm:</b> ${currentUser.exp || "Chưa cập nhật"}</div>
        <div><b>Môn dạy:</b> ${currentUser.subject || "Chưa cập nhật"}</div>
        <div><b>Giới tính:</b> ${currentUser.gender || "Chưa cập nhật"}</div>
      </div>
    </div>
    <div style="margin-top:8px; text-align:right;">
      <button id="edit-profile-btn" class="btn btn-outline btn-xs">
        Chỉnh sửa hồ sơ
      </button>
    </div>
  `;

  let classesHtml = "";
  if (apps.length === 0) {
    classesHtml =
      '<p class="muted">Bạn chưa đăng ký lớp nào. Hãy vào mục "Danh sách lớp" để đăng ký.</p>';
  } else {
    classesHtml =
      '<div class="tutor-classes"><h3 style="margin-bottom:10px;">Các lớp đã đăng ký</h3>';
    apps.forEach((app) => {
      const post = state.posts.find((p) => p.id === app.postId);
      if (!post) return;
      let statusText = "";
      if (app.status === "cho-duyet")
        statusText = "Chờ phụ huynh duyệt";
      else if (app.status === "chap-nhan" && !app.paymentConfirmed)
        statusText = "Đã được chấp nhận - cần thanh toán";
      else if (app.status === "tu-choi") statusText = "Đã bị từ chối";
      else if (app.status === "da-ket-noi")
        statusText = "Đã kết nối - liên hệ phụ huynh";

      classesHtml += `
        <div class="tutor-class-item">
          <div><b>${post.title}</b></div>
          <div style="font-size:13px; color:#4a5568;">
            ${post.subject} · ${post.grade} · ${post.location}
          </div>
          <div style="font-size:12px; margin-top:4px;">
            Trạng thái: ${statusText}
          </div>
        </div>
      `;
    });
    classesHtml += "</div>";
  }

  container.innerHTML = profileHtml + classesHtml;
}

// Gọi lại render UI khi có thay đổi
function renderAll() {
  renderNavbarUserState();
  renderClassesList();
  renderCreatePostSection();
  renderParentPosts();
  renderTutorSection();
}

// ---------------------- AUTH & REGISTER ----------------------
function handleLogin(roleType) {
  const usernameInput = document.getElementById(
    roleType === "tutor"
      ? "login-tutor-username"
      : "login-student-username"
  );
  const passwordInput = document.getElementById(
    roleType === "tutor"
      ? "login-tutor-password"
      : "login-student-password"
  );
  if (!usernameInput || !passwordInput) return;

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  if (!username || !password) {
    alert("Vui lòng nhập đầy đủ tên tài khoản và mật khẩu.");
    return;
  }

  let allowedRoles =
    roleType === "tutor" ? ["gia-su"] : ["hoc-sinh", "phu-huynh"];

  const user = state.users.find(
    (u) =>
      u.username === username &&
      u.password === password &&
      allowedRoles.includes(u.role)
  );
  if (!user) {
    alert(
      "Sai thông tin đăng nhập hoặc không đúng loại tài khoản (gia sư / phụ huynh / học sinh)."
    );
    return;
  }

  state.currentUserId = user.id;
  saveState();
  hideModal("login-modal");
  renderAll();
  alert("Đăng nhập thành công!");
}

function handleRegister() {
  const lastName = document.getElementById("reg-lastname")?.value.trim();
  const firstName = document.getElementById("reg-firstname")?.value.trim();
  const email = document.getElementById("reg-email")?.value.trim();
  const phone = document.getElementById("reg-phone")?.value.trim();
  const username = document.getElementById("reg-username")?.value.trim();
  const password = document.getElementById("reg-password")?.value.trim();
  const role = document.getElementById("reg-role")?.value;

  if (!lastName || !firstName || !email || !phone || !username || !password) {
    alert("Vui lòng điền đầy đủ các trường bắt buộc.");
    return;
  }

  const existed = state.users.find((u) => u.username === username);
  if (existed) {
    alert("Tên tài khoản đã tồn tại, vui lòng chọn tên khác.");
    return;
  }

  const newUser = {
    id: uid(),
    username,
    password,
    role,
    firstName,
    lastName,
    phone,
    email,
    edu: "",
    exp: "",
    subject: "",
    gender: "",
  };

  state.users.push(newUser);
  state.currentUserId = newUser.id;
  saveState();
  hideModal("register-modal");
  renderAll();
  alert("Đăng ký thành công! Bạn đã được đăng nhập tự động.");
}

function handleLogout() {
  state.currentUserId = null;
  saveState();
  renderAll();
}

// ---------------------- POST & APPLICATION LOGIC ----------------------
function handleCreatePost() {
  const currentUser = getCurrentUser();
  if (!currentUser || (currentUser.role !== "phu-huynh" && currentUser.role !== "hoc-sinh")) {
    alert("Chỉ Phụ huynh/Học sinh mới được đăng bài.");
    return;
  }

  const title = document.getElementById("post-title")?.value.trim();
  const subject = document.getElementById("post-subject")?.value.trim();
  const grade = document.getElementById("post-grade")?.value.trim();
  const location = document.getElementById("post-location")?.value.trim();
  const schedule = document.getElementById("post-schedule")?.value.trim();
  const fee = document.getElementById("post-fee")?.value.trim();
  const requirements = document.getElementById("post-req")?.value.trim();
  const phone = document.getElementById("post-phone")?.value.trim();

  if (!title || !subject || !grade || !location || !schedule || !fee || !phone) {
    alert("Vui lòng điền đầy đủ các thông tin có dấu *.");
    return;
  }

  const newPost = {
    id: uid(),
    title,
    subject,
    grade,
    location,
    schedule,
    fee,
    requirements,
    contactName:
      `${currentUser.lastName || ""} ${currentUser.firstName || ""}`.trim() ||
      "Phụ huynh",
    contactPhone: phone,
    createdByUserId: currentUser.id,
    createdAt: Date.now(),
  };

  state.posts.push(newPost);
  saveState();
  renderAll();
  alert("Đăng bài thành công! Gia sư có thể xem và đăng ký nhận lớp.");
}

function handleApplyClass(postId) {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== "gia-su") {
    alert("Bạn cần đăng nhập với vai trò Gia sư để đăng ký nhận lớp.");
    return;
  }

  const existed = state.applications.find(
    (a) => a.postId === postId && a.tutorId === currentUser.id
  );
  if (existed) {
    alert("Bạn đã đăng ký lớp này rồi.");
    return;
  }

  const newApp = {
    id: uid(),
    postId,
    tutorId: currentUser.id,
    status: "cho-duyet", // cho-duyet | chap-nhan | tu-choi | da-ket-noi
    paymentConfirmed: false,
    createdAt: Date.now(),
  };

  state.applications.push(newApp);
  saveState();
  renderAll();
  alert("Đã gửi yêu cầu nhận lớp. Vui lòng chờ phụ huynh duyệt.");
}

function handleParentDecision(appId, accept) {
  const currentUser = getCurrentUser();
  if (!currentUser || (currentUser.role !== "phu-huynh" && currentUser.role !== "hoc-sinh")) {
    alert("Chỉ Phụ huynh/Học sinh mới được duyệt gia sư.");
    return;
  }

  const app = state.applications.find((a) => a.id === appId);
  if (!app) return;

  const post = state.posts.find((p) => p.id === app.postId);
  if (!post || post.createdByUserId !== currentUser.id) {
    alert("Bạn không có quyền duyệt yêu cầu này.");
    return;
  }

  if (app.status !== "cho-duyet") {
    alert("Yêu cầu này đã được xử lý trước đó.");
    return;
  }

  app.status = accept ? "chap-nhan" : "tu-choi";
  saveState();
  renderAll();
}

function openPaymentForApp(appId) {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== "gia-su") {
    alert("Chỉ Gia sư mới được thanh toán phí nhận lớp.");
    return;
  }

  const app = state.applications.find((a) => a.id === appId);
  if (!app) return;

  const post = state.posts.find((p) => p.id === app.postId);
  if (!post) return;

  if (app.status !== "chap-nhan") {
    alert("Yêu cầu này chưa được phụ huynh chấp nhận hoặc đã xử lý.");
    return;
  }

  state.currentPaymentAppId = app.id;
  const feeText = document.getElementById("payment-fee-text");
  if (feeText) {
    feeText.textContent =
      "Phí nhận lớp: 25% lương tháng đầu tiên (demo). Lớp: " +
      post.title;
  }
  showModal("payment-modal");
}

function handlePaymentConfirm() {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== "gia-su") {
    hideModal("payment-modal");
    return;
  }
  const appId = state.currentPaymentAppId;
  const app = state.applications.find((a) => a.id === appId);
  if (!app) {
    hideModal("payment-modal");
    return;
  }

  app.paymentConfirmed = true;
  app.status = "da-ket-noi";
  state.currentPaymentAppId = null;
  saveState();
  hideModal("payment-modal");
  renderAll();
  alert(
    "Đã xác nhận thanh toán (demo). Bạn có thể liên hệ phụ huynh để bắt đầu lớp."
  );
}

// ---------------------- EDIT PROFILE ----------------------
function openEditProfileModal() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  document.getElementById("edit-lastname").value =
    currentUser.lastName || "";
  document.getElementById("edit-firstname").value =
    currentUser.firstName || "";
  document.getElementById("edit-phone").value = currentUser.phone || "";
  document.getElementById("edit-email").value = currentUser.email || "";
  document.getElementById("edit-edu").value = currentUser.edu || "";
  document.getElementById("edit-exp").value = currentUser.exp || "";
  document.getElementById("edit-subject").value =
    currentUser.subject || "";
  document.getElementById("edit-gender").value =
    currentUser.gender || "Nam";

  showModal("edit-profile-modal");
}

function saveProfileChanges() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  currentUser.lastName =
    document.getElementById("edit-lastname").value.trim();
  currentUser.firstName =
    document.getElementById("edit-firstname").value.trim();
  currentUser.phone = document.getElementById("edit-phone").value.trim();
  currentUser.email = document.getElementById("edit-email").value.trim();
  currentUser.edu = document.getElementById("edit-edu").value.trim();
  currentUser.exp = document.getElementById("edit-exp").value.trim();
  currentUser.subject =
    document.getElementById("edit-subject").value.trim();
  currentUser.gender =
    document.getElementById("edit-gender").value || "Nam";

  saveState();
  hideModal("edit-profile-modal");
  renderAll();
  alert("Đã lưu thay đổi hồ sơ.");
}

// ---------------------- UI INIT ----------------------
document.addEventListener("DOMContentLoaded", () => {
  loadState();
  seedDemoDataIfEmpty();
  renderAll();

  // NAV: chuyển trang
  const navBtns = document.querySelectorAll(".nav-page-btn");
  navBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      if (!targetId) return;

      // active class
      navBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // ẩn/hiện section
      const sections = document.querySelectorAll("main section");
      sections.forEach((sec) => {
        if (sec.id === targetId) sec.classList.remove("hidden");
        else sec.classList.add("hidden");
      });

      // scroll lên đầu
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Hero buttons
  document
    .getElementById("hero-go-classes")
    ?.addEventListener("click", () => {
      const btn = document.querySelector(
        '.nav-page-btn[data-target="classes-section"]'
      );
      if (btn) btn.click();
    });
  document
    .getElementById("hero-go-register")
    ?.addEventListener("click", () => {
      showModal("register-modal");
      const roleSelect = document.getElementById("reg-role");
      if (roleSelect) roleSelect.value = "gia-su";
    });

  // Open login/register
  document.getElementById("open-login")?.addEventListener("click", () => {
    showModal("login-modal");
  });
  document
    .getElementById("open-register")
    ?.addEventListener("click", () => {
      showModal("register-modal");
    });

  // Switch login/register from inside modal
  document
    .getElementById("open-register-from-login")
    ?.addEventListener("click", (e) => {
      e.preventDefault();
      hideModal("login-modal");
      showModal("register-modal");
    });
  document
    .getElementById("open-login-from-register")
    ?.addEventListener("click", (e) => {
      e.preventDefault();
      hideModal("register-modal");
      showModal("login-modal");
    });

  // Đóng modal bằng nút X
  document.querySelectorAll(".modal-close").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.closeModal;
      if (target) hideModal(target);
    });
  });

  // Click ra ngoài modal để đóng
  document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        hideModal(backdrop.id);
      }
    });
  });

  // Toggle password
  document.querySelectorAll(".toggle-password").forEach((btn) => {
    btn.addEventListener("click", () => {
      const wrapper = btn.closest(".password-wrapper");
      if (!wrapper) return;
      const input = wrapper.querySelector(".password-input");
      if (!input) return;
      input.type = input.type === "password" ? "text" : "password";
    });
  });

  // Login tabs (Học sinh/Phụ huynh vs Gia sư)
  const loginTabs = document.querySelectorAll(".modal-tab");
  const loginStudentForm = document.getElementById("login-student-form");
  const loginTutorForm = document.getElementById("login-tutor-form");
  loginTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      loginTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.dataset.loginTarget;
      if (target === "student") {
        loginStudentForm?.classList.remove("hidden");
        loginTutorForm?.classList.add("hidden");
      } else {
        loginStudentForm?.classList.add("hidden");
        loginTutorForm?.classList.remove("hidden");
      }
    });
  });

  // Login submit
  document
    .getElementById("login-student-submit")
    ?.addEventListener("click", () => handleLogin("student"));
  document
    .getElementById("login-tutor-submit")
    ?.addEventListener("click", () => handleLogin("tutor"));

  // Register submit
  document
    .getElementById("register-submit")
    ?.addEventListener("click", handleRegister);

  // Logout
  document
    .getElementById("logout-btn")
    ?.addEventListener("click", () => {
      handleLogout();
      alert("Đã đăng xuất.");
    });

  // Payment confirm
  document
    .getElementById("payment-confirm")
    ?.addEventListener("click", handlePaymentConfirm);

  // Save profile in edit modal
  const editProfileModal = document.getElementById("edit-profile-modal");
  if (editProfileModal) {
    const saveBtn = editProfileModal.querySelector(
      ".btn.btn-primary"
    );
    saveBtn?.addEventListener("click", saveProfileChanges);
  }

  // ----------------- GLOBAL CLICK (DELEGATION) -----------------
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    if (btn.id === "create-post-submit") {
      handleCreatePost();
    } else if (btn.classList.contains("class-apply-btn")) {
      const postId = btn.dataset.postId;
      if (postId) handleApplyClass(postId);
    } else if (btn.classList.contains("parent-accept-btn")) {
      const appId = btn.dataset.appId;
      if (appId) handleParentDecision(appId, true);
    } else if (btn.classList.contains("parent-reject-btn")) {
      const appId = btn.dataset.appId;
      if (appId) handleParentDecision(appId, false);
    } else if (btn.classList.contains("open-payment-btn")) {
      const appId = btn.dataset.appId;
      if (appId) openPaymentForApp(appId);
    } else if (btn.id === "edit-profile-btn") {
      openEditProfileModal();
    }
  });
});
