document.addEventListener("DOMContentLoaded", () => {
  // ========================================
  //  EduMentor DEMO - FRONTEND + LOCALSTORAGE
  // ========================================

  const LS_KEY = "edm_state_v1";

  let state = {
    users: [],
    posts: [],
    applications: [],
    currentUserId: null,
    currentPaymentAppId: null,
  };

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

  // Seed demo
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
      label.textContent = `${roleLabel(user.role)} - ${
        fullName || user.username
      }`;
    }
  }

  function renderClassesList() {
    const container = document.getElementById("classes-list");
    if (!container) return;
    container.innerHTML = "";

    if (state.posts.length === 0) {
      container.innerHTML =
        '<p class="muted">Hiện chưa có bài đăng nào.</p>';
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
          actionHtml = `<button class="btn btn-primary btn-xs class-apply-btn" data-post-id="${post.id}">Đăng ký nhận lớp</button>`;
        } else {
          let statusClass = "status-wait";
          let statusText = "Chờ phụ huynh duyệt";

          if (myApp.status === "chap-nhan" && !myApp.paymentConfirmed) {
            statusClass = "status-accepted";
            statusText = "Được chấp nhận - chờ thanh toán";
            actionHtml = `<button class="btn btn-primary btn-xs open-payment-btn" data-app-id="${myApp.id}">Thanh toán phí</button>`;
          } else if (myApp.status === "tu-choi") {
            statusClass = "status-rejected";
            statusText = "Đã bị từ chối";
          } else if (myApp.status === "da-ket-noi") {
            statusClass = "status-connected";
            statusText = "Đã kết nối";
          }

          statusHtml = `<span class="status-pill ${statusClass}">${statusText}</span>`;
        }
      } else {
        const appsCount = state.applications.filter(
          (a) => a.postId === post.id
        ).length;
        statusHtml = `<span class="status-pill status-wait">Đã có ${appsCount} lượt đăng ký</span>`;
        actionHtml =
          '<span class="muted" style="font-size:12px;">Đăng nhập để đăng ký.</span>';
      }

      card.innerHTML = `
        <div class="class-top-row">
          <div class="avatar-circle">${post.subject[0]}</div>
          <div class="class-main">
            <div class="class-name">${post.title}</div>
            <div class="class-subtitle">${post.subject} · ${post.grade}</div>

            <div class="class-info-grid">
              <div class="info-item">📍 ${post.location}</div>
              <div class="info-item">⏱ ${post.schedule}</div>
              <div class="info-item">💰 ${post.fee}</div>
              <div class="info-item">👤 ${post.contactName}</div>
              <div class="info-item">📞 ${post.contactPhone}</div>
            </div>

            <div style="margin-top:8px; font-size:13px;">
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
    if (!currentUser || !["phu-huynh", "hoc-sinh"].includes(currentUser.role)) {
      container.innerHTML =
        '<p class="muted">Vui lòng đăng nhập với vai trò Phụ huynh/Học sinh để đăng bài.</p>';
      return;
    }

    container.innerHTML = `
      <p class="muted">Điền thông tin lớp học cần tìm gia sư.</p>

      <div class="form-group">
        <label>Tiêu đề *</label>
        <input id="post-title" class="input" />
      </div>

      <div class="form-group">
        <label>Môn học *</label>
        <input id="post-subject" class="input" />
      </div>

      <div class="form-group">
        <label>Lớp *</label>
        <input id="post-grade" class="input" />
      </div>

      <div class="form-group">
        <label>Khu vực *</label>
        <input id="post-location" class="input" />
      </div>

      <div class="form-group">
        <label>Lịch học *</label>
        <input id="post-schedule" class="input" />
      </div>

      <div class="form-group">
        <label>Học phí *</label>
        <input id="post-fee" class="input" />
      </div>

      <div class="form-group">
        <label>Yêu cầu</label>
        <textarea id="post-req" class="input"></textarea>
      </div>

      <div class="form-group">
        <label>SĐT liên hệ *</label>
        <input id="post-phone" class="input" value="${currentUser.phone || ""}" />
      </div>

      <button id="create-post-submit" class="btn btn-primary">📢 Đăng bài</button>
    `;
  }

  function renderParentPosts() {
    const container = document.getElementById("parent-posts-content");
    if (!container) return;

    const currentUser = getCurrentUser();
    if (!currentUser || !["phu-huynh", "hoc-sinh"].includes(currentUser.role)) {
      container.innerHTML =
        '<p class="muted">Vui lòng đăng nhập với vai trò Phụ huynh/Học sinh.</p>';
      return;
    }

    const myPosts = state.posts.filter(
      (p) => p.createdByUserId === currentUser.id
    );

    if (myPosts.length === 0) {
      container.innerHTML =
        '<p class="muted">Bạn chưa có bài đăng nào.</p>';
      return;
    }

    container.innerHTML = "";

    myPosts.forEach((post) => {
      const apps = state.applications.filter((a) => a.postId === post.id);

      const postEl = document.createElement("div");
      postEl.className = "parent-post-card";

      let appsHtml = "";

      if (apps.length === 0) {
        appsHtml =
          '<p class="muted">Chưa có gia sư đăng ký lớp này.</p>';
      } else {
        appsHtml = apps
          .map((app) => {
            const tutor = state.users.find((u) => u.id === app.tutorId);
            const tutorName = tutor
              ? `${tutor.lastName || ""} ${tutor.firstName || ""}`.trim()
              : "Gia sư";

            let statusText = "Chờ bạn duyệt";
            let statusClass = "status-wait";

            if (app.status === "chap-nhan" && !app.paymentConfirmed) {
              statusClass = "status-accepted";
              statusText = "Đã chấp nhận - chờ thanh toán";
            } else if (app.status === "tu-choi") {
              statusClass = "status-rejected";
              statusText = "Đã từ chối";
            } else if (app.status === "da-ket-noi") {
              statusClass = "status-connected";
              statusText = "Đã kết nối";
            }

            let actionHtml = "";
            if (app.status === "cho-duyet") {
              actionHtml = `
                <button class="btn btn-primary btn-xs parent-accept-btn" data-app-id="${app.id}">Chấp nhận</button>
                <button class="btn btn-outline btn-xs parent-reject-btn" data-app-id="${app.id}">Từ chối</button>
              `;
            }

            return `
              <div class="applicant-row">
                <div class="applicant-left">
                  <div class="applicant-avatar">${tutorName[0]}</div>
                  <div>${tutorName}</div>
                </div>
                <div style="text-align:right;">
                  <div class="status-pill ${statusClass}">${statusText}</div>
                  <div>${actionHtml}</div>
                </div>
              </div>
            `;
          })
          .join("");
      }

      postEl.innerHTML = `
        <div class="parent-post-title">${post.title}</div>
        <div class="parent-post-info">${post.subject} · ${post.grade} · ${post.location}</div>
        <div class="parent-post-info">Lịch: ${post.schedule} · Học phí: ${post.fee}</div>
        <div class="parent-post-info">Yêu cầu: ${post.requirements}</div>
        <div style="margin-top:10px;font-weight:600;">Gia sư đăng ký:</div>
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
        '<p class="muted">Vui lòng đăng nhập với vai trò Gia sư.</p>';
      return;
    }

    const apps = state.applications.filter((a) => a.tutorId === currentUser.id);

    let html = `
      <div class="profile-card">
        <div class="profile-avatar"></div>
        <div class="profile-main">
          <div><b>Họ tên:</b> ${currentUser.lastName} ${currentUser.firstName}</div>
          <div><b>Tài khoản:</b> ${currentUser.username}</div>
          <div><b>SĐT:</b> ${currentUser.phone}</div>
          <div><b>Email:</b> ${currentUser.email}</div>
          <div><b>Học vấn:</b> ${currentUser.edu}</div>
          <div><b>Kinh nghiệm:</b> ${currentUser.exp}</div>
          <div><b>Môn dạy:</b> ${currentUser.subject}</div>
        </div>
      </div>
      <div style="text-align:right;">
        <button id="edit-profile-btn" class="btn btn-outline btn-xs">Chỉnh sửa hồ sơ</button>
      </div>
    `;

    html += `<div class="tutor-classes"><h3>Các lớp đã đăng ký</h3>`;

    if (apps.length === 0) {
      html += '<p class="muted">Bạn chưa đăng ký lớp nào.</p>';
    } else {
      apps.forEach((app) => {
        const post = state.posts.find((p) => p.id === app.postId);
        if (!post) return;

        let statusText = "";
        if (app.status === "cho-duyet") statusText = "Chờ phụ huynh duyệt";
        else if (app.status === "chap-nhan" && !app.paymentConfirmed)
          statusText = "Đã chấp nhận - cần thanh toán";
        else if (app.status === "tu-choi") statusText = "Đã từ chối";
        else if (app.status === "da-ket-noi") statusText = "Đã kết nối";

        html += `
          <div class="tutor-class-item">
            <div><b>${post.title}</b></div>
            <div>${post.subject} · ${post.grade} · ${post.location}</div>
            <div>Trạng thái: ${statusText}</div>
          </div>
        `;
      });
    }

    html += "</div>";

    container.innerHTML = html;
  }

  function renderAll() {
    renderNavbarUserState();
    renderClassesList();
    renderCreatePostSection();
    renderParentPosts();
    renderTutorSection();
  }

  // ---------------------- LOGIN/REGISTER ----------------------
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

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    let allowedRoles =
      roleType === "tutor" ? ["gia-su"] : ["hoc-sinh", "phu-huynh"];

    const user = state.users.find(
      (u) =>
        u.username === username &&
        u.password === password &&
        allowedRoles.includes(u.role)
    );

    if (!user) {
      alert("Sai thông tin đăng nhập.");
      return;
    }

    state.currentUserId = user.id;
    saveState();
    hideModal("login-modal");
    renderAll();
    alert("Đăng nhập thành công!");
  }

  function handleRegister() {
    const lastName = document.getElementById("reg-lastname").value.trim();
    const firstName = document.getElementById("reg-firstname").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const phone = document.getElementById("reg-phone").value.trim();
    const username = document.getElementById("reg-username").value.trim();
    const password = document.getElementById("reg-password").value.trim();
    const role = document.getElementById("reg-role").value;

    if (!lastName || !firstName || !email || !phone || !username || !password) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    const existed = state.users.find((u) => u.username === username);
    if (existed) {
      alert("Tên tài khoản đã tồn tại.");
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
    alert("Đăng ký thành công!");
  }

  function handleLogout() {
    state.currentUserId = null;
    saveState();
    renderAll();
  }

  // ---------------------- POST ----------------------
  function handleCreatePost() {
    const currentUser = getCurrentUser();
    if (!currentUser || !["phu-huynh", "hoc-sinh"].includes(currentUser.role)) {
      alert("Chỉ Phụ huynh/Học sinh được đăng bài.");
      return;
    }

    const title = document.getElementById("post-title").value.trim();
    const subject = document.getElementById("post-subject").value.trim();
    const grade = document.getElementById("post-grade").value.trim();
    const location = document.getElementById("post-location").value.trim();
    const schedule = document.getElementById("post-schedule").value.trim();
    const fee = document.getElementById("post-fee").value.trim();
    const requirements = document.getElementById("post-req").value.trim();
    const phone = document.getElementById("post-phone").value.trim();

    if (!title || !subject || !grade || !location || !schedule || !fee || !phone) {
      alert("Vui lòng nhập đủ trường bắt buộc.");
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
        `${currentUser.lastName} ${currentUser.firstName}`.trim(),
      contactPhone: phone,
      createdByUserId: currentUser.id,
      createdAt: Date.now(),
    };

    state.posts.push(newPost);
    saveState();
    renderAll();
    alert("Đã đăng bài thành công!");
  }

  // ---------------------- APPLICATION ----------------------
  function handleApplyClass(postId) {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== "gia-su") {
      alert("Đăng nhập với vai trò gia sư để nhận lớp.");
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
      status: "cho-duyet",
      paymentConfirmed: false,
      createdAt: Date.now(),
    };

    state.applications.push(newApp);
    saveState();
    renderAll();
    alert("Đã gửi yêu cầu nhận lớp.");
  }

  function handleParentDecision(appId, accept) {
    const currentUser = getCurrentUser();
    if (!currentUser || !["phu-huynh", "hoc-sinh"].includes(currentUser.role)) {
      alert("Không hợp lệ.");
      return;
    }

    const app = state.applications.find((a) => a.id === appId);
    if (!app) return;

    const post = state.posts.find((p) => p.id === app.postId);
    if (!post || post.createdByUserId !== currentUser.id) {
      alert("Bạn không có quyền duyệt.");
      return;
    }

    if (app.status !== "cho-duyet") {
      alert("Yêu cầu đã được xử lý trước đó.");
      return;
    }

    app.status = accept ? "chap-nhan" : "tu-choi";
    saveState();
    renderAll();
  }

  function openPaymentForApp(appId) {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== "gia-su") return;

    const app = state.applications.find((a) => a.id === appId);
    if (!app) return;

    const post = state.posts.find((p) => p.id === app.postId);
    if (!post) return;

    if (app.status !== "chap-nhan") {
      alert("Không thể thanh toán.");
      return;
    }

    state.currentPaymentAppId = app.id;
    document.getElementById(
      "payment-fee-text"
    ).textContent = `Phí nhận lớp: 25% lương tháng đầu tiên. Lớp: ${post.title}`;
    showModal("payment-modal");
  }

  function handlePaymentConfirm() {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== "gia-su") return;

    const appId = state.currentPaymentAppId;
    const app = state.applications.find((a) => a.id === appId);
    if (!app) return;

    app.paymentConfirmed = true;
    app.status = "da-ket-noi";
    state.currentPaymentAppId = null;

    saveState();
    hideModal("payment-modal");
    renderAll();

    alert("Thanh toán thành công!");
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

    currentUser.lastName = document
      .getElementById("edit-lastname")
      .value.trim();
    currentUser.firstName = document
      .getElementById("edit-firstname")
      .value.trim();
    currentUser.phone = document.getElementById("edit-phone").value.trim();
    currentUser.email = document.getElementById("edit-email").value.trim();
    currentUser.edu = document.getElementById("edit-edu").value.trim();
    currentUser.exp = document.getElementById("edit-exp").value.trim();
    currentUser.subject = document
      .getElementById("edit-subject")
      .value.trim();
    currentUser.gender = document.getElementById("edit-gender").value.trim();

    saveState();
    hideModal("edit-profile-modal");
    renderAll();

    alert("Đã lưu thay đổi.");
  }

  // ===========================================================
  // UI INIT — TẤT CẢ LOGIC GIAO DIỆN TẠI ĐÂY
  // ===========================================================

  loadState();
  seedDemoDataIfEmpty();
  renderAll();

  // NAV: chuyển trang
  document.querySelectorAll(".nav-page-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;

      document.querySelectorAll(".nav-page-btn").forEach((b) =>
        b.classList.remove("active")
      );
      btn.classList.add("active");

      document.querySelectorAll("main section").forEach((sec) => {
        sec.classList.toggle("hidden", sec.id !== targetId);
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // HERO buttons
  document.getElementById("hero-go-classes")?.addEventListener("click", () => {
    document.querySelector('.nav-page-btn[data-target="classes-section"]')?.click();
  });
  document.getElementById("hero-go-register")?.addEventListener("click", () => {
    showModal("register-modal");
    const roleSelect = document.getElementById("reg-role");
    if (roleSelect) roleSelect.value = "gia-su";
  });

  // Open Login/Register
  document.getElementById("open-login")?.addEventListener("click", () => {
    showModal("login-modal");
  });
  document.getElementById("open-register")?.addEventListener("click", () => {
    showModal("register-modal");
  });

  // Switch inside modal
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

  // Close modal
  document.querySelectorAll(".modal-close").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.closeModal;
      if (target) hideModal(target);
    });
  });

    // Click outside to close modal
    document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
        backdrop.addEventListener("click", (e) => {
            if (e.target === backdrop) hideModal(backdrop.id);
        });
    });

    // Toggle password
    document.querySelectorAll(".toggle-password").forEach((btn) => {
        btn.addEventListener("click", () => {
            const wrapper = btn.closest(".password-wrapper");
            const input = wrapper.querySelector(".password-input");
            input.type = input.type === "password" ? "text" : "password";
        });
    });

    // =============== LOGIN TABS ===============
    const loginTabs = document.querySelectorAll(".modal-tab");
    const loginStudentForm = document.getElementById("login-student-form");
    const loginTutorForm = document.getElementById("login-tutor-form");

    loginTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            loginTabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");

            const target = tab.dataset.loginTarget;

            if (target === "student") {
                loginStudentForm.classList.remove("hidden");
                loginTutorForm.classList.add("hidden");
            } else {
                loginStudentForm.classList.add("hidden");
                loginTutorForm.classList.remove("hidden");
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
    document.getElementById("logout-btn")?.addEventListener("click", () => {
        handleLogout();
        alert("Đã đăng xuất.");
    });

    // ----------------- GLOBAL CLICK (DELEGATION) -----------------
    document.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;

        if (btn.id === "create-post-submit") {
            handleCreatePost();
        } else if (btn.classList.contains("class-apply-btn")) {
            handleApplyClass(btn.dataset.postId);
        } else if (btn.classList.contains("parent-accept-btn")) {
            handleParentDecision(btn.dataset.appId, true);
        } else if (btn.classList.contains("parent-reject-btn")) {
            handleParentDecision(btn.dataset.appId, false);
        } else if (btn.classList.contains("open-payment-btn")) {
            openPaymentForApp(btn.dataset.appId);
        } else if (btn.id === "edit-profile-btn") {
            openEditProfileModal();
        }
    });

    // ✅ Cái này là đúng: ĐÓNG DOMContentLoaded
});

