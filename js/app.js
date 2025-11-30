document.addEventListener("DOMContentLoaded", () => {
    // ============================================
    //            EDU-MENTOR DEMO STATE
    // ============================================

    const LS_KEY = "edm_state_v1";

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

    // ---------------------- DEMO SEED ----------------------
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
                email: "parent@example.com",
            },
            {
                id: tutorId,
                username: "giasu1",
                password: "123456",
                role: "gia-su",
                firstName: "Ngọc",
                lastName: "Phạm",
                phone: "0902 345 678",
                email: "tutor@example.com",
                edu: "SV Đại học Bách khoa",
                exp: "1 năm dạy kèm Toán - Lý",
                subject: "Toán, Lý",
            }
        );

        state.posts.push({
            id: uid(),
            title: "Cần gia sư Toán 9 luyện thi vào 10",
            subject: "Toán",
            grade: "Lớp 9",
            location: "Quận 10",
            schedule: "3 buổi/tuần",
            fee: "2.000.000đ/tháng",
            contactName: "Phụ huynh A",
            contactPhone: "0901 234 567",
            requirements: "Ưu tiên SV Bách khoa",
            createdByUserId: parentId,
            createdAt: Date.now(),
        });

        saveState();
    }

    // ---------------------- MODAL ----------------------
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
    function renderNavbar() {
        const guest = document.getElementById("guest-actions");
        const userPanel = document.getElementById("user-actions");
        const label = document.getElementById("current-user-label");

        const user = getCurrentUser();
        if (!guest || !userPanel || !label) return;

        if (!user) {
            guest.classList.remove("hidden");
            userPanel.classList.add("hidden");
            label.textContent = "";
        } else {
            guest.classList.add("hidden");
            userPanel.classList.remove("hidden");
            label.textContent = `${roleLabel(user.role)} - ${user.lastName} ${user.firstName}`;
        }
    }

    function renderClasses() {
        const container = document.getElementById("classes-list");
        container.innerHTML = "";

        const posts = [...state.posts].sort((a, b) => b.createdAt - a.createdAt);
        const user = getCurrentUser();

        posts.forEach((post) => {
            const card = document.createElement("div");
            card.className = "class-card";

            let statusHtml = "";
            let actionHtml = "";

            // Gia sư
            if (user && user.role === "gia-su") {
                const myApp = state.applications.find(
                    (a) => a.postId === post.id && a.tutorId === user.id
                );

                if (!myApp) {
                    statusHtml = `<span class="status-pill status-wait">Chưa đăng ký</span>`;
                    actionHtml = `<button class="btn btn-primary btn-xs class-apply-btn" data-post-id="${post.id}">Đăng ký nhận lớp</button>`;
                } else {
                    let text = "Chờ duyệt";
                    let cls = "status-wait";

                    if (myApp.status === "chap-nhan" && !myApp.paymentConfirmed) {
                        text = "Đã chấp nhận - chờ thanh toán";
                        cls = "status-accepted";
                        actionHtml = `<button class="btn btn-primary btn-xs open-payment-btn" data-app-id="${myApp.id}">Thanh toán</button>`;
                    } else if (myApp.status === "tu-choi") {
                        text = "Bị từ chối";
                        cls = "status-rejected";
                    } else if (myApp.status === "da-ket-noi") {
                        text = "Đã kết nối";
                        cls = "status-connected";
                    }

                    statusHtml = `<span class="status-pill ${cls}">${text}</span>`;
                }
            } else {
                const c = state.applications.filter((a) => a.postId === post.id).length;
                statusHtml = `<span class="status-pill status-wait">Đã có ${c} đăng ký</span>`;
                actionHtml = `<span class="muted" style="font-size:12px;">Đăng nhập vai trò gia sư để nhận lớp</span>`;
            }

            card.innerHTML = `
        <div class="class-top-row">
          <div class="avatar-circle">${post.subject[0]}</div>
          <div class="class-main">
            <div class="class-name">${post.title}</div>
            <div class="class-subtitle">${post.subject} · ${post.grade}</div>
            <div class="class-info-grid">
              <div>📍 ${post.location}</div>
              <div>⏱ ${post.schedule}</div>
              <div>💰 ${post.fee}</div>
              <div>👤 ${post.contactName}</div>
              <div>📞 ${post.contactPhone}</div>
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

    function renderAll() {
        renderNavbar();
        renderClasses();
    }

    // ---------------------- LOGIN ----------------------
    function handleLogin(roleType) {
        const username = document.getElementById(
            roleType === "tutor" ? "login-tutor-username" : "login-student-username"
        ).value.trim();

        const password = document.getElementById(
            roleType === "tutor" ? "login-tutor-password" : "login-student-password"
        ).value.trim();

        const roles = roleType === "tutor" ? ["gia-su"] : ["hoc-sinh", "phu-huynh"];

        const user = state.users.find(
            (u) => u.username === username && u.password === password && roles.includes(u.role)
        );

        if (!user) return alert("Sai thông tin đăng nhập.");

        state.currentUserId = user.id;
        saveState();

        hideModal("login-modal");
        renderAll();
        alert("Đăng nhập thành công!");
    }

    // ---------------------- REGISTER ----------------------
    function handleRegister() {
        const ln = document.getElementById("reg-lastname").value.trim();
        const fn = document.getElementById("reg-firstname").value.trim();
        const email = document.getElementById("reg-email").value.trim();
        const phone = document.getElementById("reg-phone").value.trim();
        const username = document.getElementById("reg-username").value.trim();
        const password = document.getElementById("reg-password").value.trim();
        const role = document.getElementById("reg-role").value;

        if (!ln || !fn || !email || !phone || !username || !password)
            return alert("Vui lòng nhập đầy đủ.");

        if (state.users.some((u) => u.username === username))
            return alert("Tên tài khoản đã tồn tại.");

        const newUser = {
            id: uid(),
            username,
            password,
            role,
            firstName: fn,
            lastName: ln,
            phone,
            email,
        };

        state.users.push(newUser);
        state.currentUserId = newUser.id;
        saveState();

        hideModal("register-modal");
        renderAll();
        alert("Đăng ký thành công!");
    }

    // ---------------------- APPLY CLASS ----------------------
    function handleApplyClass(postId) {
        const user = getCurrentUser();
        if (!user || user.role !== "gia-su")
            return alert("Chỉ gia sư mới được đăng ký.");

        if (
            state.applications.some(
                (a) => a.postId === postId && a.tutorId === user.id
            )
        )
            return alert("Bạn đã đăng ký lớp này rồi!");

        state.applications.push({
            id: uid(),
            postId,
            tutorId: user.id,
            status: "cho-duyet",
            paymentConfirmed: false,
            createdAt: Date.now(),
        });

        saveState();
        renderAll();
        alert("Đã gửi yêu cầu nhận lớp!");
    }

    // ---------------------- PAYMENT ----------------------
    function openPaymentForApp(appId) {
        const user = getCurrentUser();
        if (!user || user.role !== "gia-su") return;

        const app = state.applications.find((a) => a.id === appId);
        if (!app) return;

        state.currentPaymentAppId = appId;

        document.getElementById("payment-fee-text").textContent =
            "Phí nhận lớp: 25% tháng đầu (demo)";

        showModal("payment-modal");
    }

    function handlePaymentConfirm() {
        const user = getCurrentUser();
        if (!user || user.role !== "gia-su") return;

        const app = state.applications.find(
            (a) => a.id === state.currentPaymentAppId
        );
        if (!app) return;

        app.paymentConfirmed = true;
        app.status = "da-ket-noi";

        saveState();
        hideModal("payment-modal");
        renderAll();

        alert("Thanh toán thành công!");
    }

    // ---------------------- EVENT BINDING ----------------------

    // NAVIGATION
    document.querySelectorAll(".nav-page-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.target;

            document
                .querySelectorAll(".nav-page-btn")
                .forEach((b) => b.classList.remove("active"));

            btn.classList.add("active");

            document.querySelectorAll("main section").forEach((sec) => {
                sec.classList.toggle("hidden", sec.id !== id);
            });

            window.scrollTo({ top: 0 });
        });
    });

    // MODALS
    document.getElementById("open-login")?.addEventListener("click", () => {
        showModal("login-modal");
    });

    document.getElementById("open-register")?.addEventListener("click", () => {
        showModal("register-modal");
    });

    document.querySelectorAll(".modal-close").forEach((btn) => {
        btn.addEventListener("click", () => hideModal(btn.dataset.closeModal));
    });

    document.querySelectorAll(".modal-backdrop").forEach((b) =>
        b.addEventListener("click", (e) => {
            if (e.target === b) hideModal(b.id);
        })
    );

    // LOGIN TABS
    const loginTabs = document.querySelectorAll(".modal-tab");
    const studentForm = document.getElementById("login-student-form");
    const tutorForm = document.getElementById("login-tutor-form");

    loginTabs.forEach((tab) =>
        tab.addEventListener("click", () => {
            loginTabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");

            const target = tab.dataset.loginTarget;
            if (target === "student") {
                studentForm.classList.remove("hidden");
                tutorForm.classList.add("hidden");
            } else {
                tutorForm.classList.remove("hidden");
                studentForm.classList.add("hidden");
            }
        })
    );

    // LOGIN SUBMIT
    document
        .getElementById("login-student-submit")
        ?.addEventListener("click", () => handleLogin("student"));

    document
        .getElementById("login-tutor-submit")
        ?.addEventListener("click", () => handleLogin("tutor"));

    // REGISTER
    document
        .getElementById("register-submit")
        ?.addEventListener("click", handleRegister);

    // PAYMENT
    document
        .getElementById("payment-confirm")
        ?.addEventListener("click", handlePaymentConfirm);

    // GLOBAL BUTTON DELEGATION
    document.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;

        if (btn.classList.contains("class-apply-btn"))
            handleApplyClass(btn.dataset.postId);

        if (btn.classList.contains("open-payment-btn"))
            openPaymentForApp(btn.dataset.appId);
    });

    // ---------------------- INIT ----------------------
    loadState();
    seedDemoDataIfEmpty();
    renderAll();
});
