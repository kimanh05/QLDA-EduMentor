/* ====================== STORAGE KEYS ======================= */
const USERS_KEY = "edm_users";
const CURRENT_KEY = "edm_current_user";
const CLASSES_KEY = "edm_classes";
const REQUESTS_KEY = "edm_requests";

/* ====================== LOAD / SAVE ======================= */
function load(key, fallback) {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    try { return JSON.parse(raw); } catch { return fallback; }
}

function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

/* ====================== INITIAL DATA ======================= */
let users = load(USERS_KEY, []);
let currentUser = load(CURRENT_KEY, null);
let classes = load(CLASSES_KEY, []);
let requests = load(REQUESTS_KEY, []);

/* Nếu chưa có lớp mẫu */
if (classes.length === 0) {
    classes = [
        {
            id: 1,
            parent: "phuhuynh1",
            parentName: "Nguyễn Văn A",
            subject: "Toán",
            grade: "Lớp 9",
            address: "Q1, TP.HCM",
            schedule: "T2/T4/T6",
            fee: "2.000.000 VND",
            goal: "Cải thiện điểm",
            gender: "Không yêu cầu",
            degree: "Sinh viên Sư Phạm",
            phone: "0901112222"
        },
        {
            id: 2,
            parent: "phuhuynh1",
            parentName: "Nguyễn Văn A",
            subject: "Tiếng Anh",
            grade: "Lớp 8",
            address: "Q5, TP.HCM",
            schedule: "T3/T5",
            fee: "1.800.000 VND",
            goal: "Luyện giao tiếp",
            gender: "Nữ",
            degree: "Sinh viên năm 3",
            phone: "0901112222"
        }
    ];
    save(CLASSES_KEY, classes);
}

/* ====================== PAGE SWITCH ======================= */
function showPage(id) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

document.getElementById("link-home").onclick = () => showPage("home-page");
document.getElementById("link-classes").onclick = () => showPage("classes-page");
document.getElementById("link-tutor").onclick = () => showPage("tutor-page");
document.getElementById("link-parent").onclick = () => showPage("parent-page");

/* ====================== UPDATE NAV ======================= */
function refreshNavbar() {
    const navRight = document.querySelector(".nav-right");
    navRight.innerHTML = "";

    if (!currentUser) {
        navRight.innerHTML = `
            <button class="btn-outline small" id="btn-open-login">Đăng nhập</button>
            <button class="btn-primary small" id="btn-open-register">Đăng ký</button>
        `;
    } else {
        navRight.innerHTML = `
            <span>👤 ${currentUser.last} ${currentUser.first} (${currentUser.role})</span>
            <button class="btn-primary small" id="btn-logout">Đăng xuất</button>
        `;
    }

    // Re-bind events
    const loginBtn = document.getElementById("btn-open-login");
    const regBtn = document.getElementById("btn-open-register");
    const logoutBtn = document.getElementById("btn-logout");

    if (loginBtn) loginBtn.onclick = () => openModal("login-modal");
    if (regBtn) regBtn.onclick = () => openModal("register-modal");
    if (logoutBtn) logoutBtn.onclick = logout;
}

/* ====================== MODAL ======================= */
function openModal(id) {
    document.getElementById(id).classList.remove("hidden");
}

function closeModal(id) {
    document.getElementById(id).classList.add("hidden");
}

document.querySelectorAll(".btn-close").forEach(btn => {
    btn.onclick = () => closeModal(btn.dataset.close);
});

/* ====================== REGISTER ======================= */
document.getElementById("btn-register").onclick = () => {
    const last = document.getElementById("reg-last").value.trim();
    const first = document.getElementById("reg-first").value.trim();
    const username = document.getElementById("reg-username").value.trim();
    const password = document.getElementById("reg-password").value.trim();
    const role = document.getElementById("reg-role").value;

    if (!username || !password || !last || !first) {
        alert("Vui lòng nhập đủ thông tin.");
        return;
    }

    if (users.some(u => u.username === username)) {
        alert("Tên tài khoản đã tồn tại!");
        return;
    }

    let newUser = {
        username,
        password,
        first,
        last,
        role,
        achievements: "",
        rating: 0,
        testPassed: false
    };

    users.push(newUser);
    save(USERS_KEY, users);

    alert("Đăng ký thành công!");
    closeModal("register-modal");
};

/* ====================== LOGIN ======================= */
document.getElementById("btn-login").onclick = () => {
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();

    const user = users.find(
        u => u.username === username && u.password === password
    );

    if (!user) {
        alert("Sai tên tài khoản hoặc mật khẩu!");
        return;
    }

    // Nếu là gia sư nhưng chưa test → bắt test
    if (user.role === "gia-su" && !user.testPassed) {
        closeModal("login-modal");
        startTutorTest(user);
        return;
    }

    currentUser = user;
    save(CURRENT_KEY, user);

    closeModal("login-modal");
    refreshNavbar();
    render();
    alert("Đăng nhập thành công!");
};

/* ====================== TUTOR TEST ======================= */
function startTutorTest(user) {
    let score = 0;
    let q1 = prompt("Câu 1: Giải 2x + 3 = 7. x = ?");
    if (q1 == "2") score++;

    let q2 = prompt("Câu 2: 5 + 3 × 2 = ?");
    if (q2 == "11") score++;

    let q3 = prompt("Câu 3: Định nghĩa đạo hàm? (trả lời 'a' nếu đúng)");
    if (q3?.toLowerCase() === "a") score++;

    let q4 = prompt("Câu 4: Tiếng Anh: Từ 'improve' nghĩa là gì?");
    if (q4?.toLowerCase().includes("cải thiện")) score++;

    let q5 = prompt("Câu 5: 9 × 7 = ?");
    if (q5 == "63") score++;

    let q6 = prompt("Câu 6: Hình có 3 cạnh là gì?");
    if (q6?.toLowerCase().includes("tam giác")) score++;

    let q7 = prompt("Câu 7: Công thức tính diện tích hình tròn?");
    if (q7?.toLowerCase().includes("pi") || q7.includes("π")) score++;

    let q8 = prompt("Câu 8: x² - 4 = 0 → x = ?");
    if (q8 == "2" || q8 == "-2") score++;

    let q9 = prompt("Câu 9: 4 tiếng Anh là gì?");
    if (q9?.toLowerCase() === "four") score++;

    let q10 = prompt("Câu 10: 'education' nghĩa là gì?");
    if (q10?.includes("giáo")) score++;

    if (score >= 8) {
        alert("Bạn được: " + score + "/10 – PASS ✔");
        user.testPassed = true;
        save(USERS_KEY, users);
        currentUser = user;
        save(CURRENT_KEY, user);
        refreshNavbar();
        render();
    } else {
        alert("Chỉ được " + score + "/10 → FAIL ❌. Không thể trở thành gia sư.");
    }
}

/* ====================== LOGOUT ======================= */
function logout() {
    currentUser = null;
    save(CURRENT_KEY, null);
    refreshNavbar();
    render();
}

/* ====================== RENDER CLASSES ======================= */
function renderClasses() {
    const list = document.getElementById("classes-list");
    list.innerHTML = "";

    classes.forEach(c => {
        const card = document.createElement("div");
        card.className = "class-card";
        card.innerHTML = `
            <h3>${c.subject} – ${c.grade}</h3>
            <div class="row">📍 ${c.address}</div>
            <div class="row">⏰ ${c.schedule}</div>
            <div class="row">💰 ${c.fee}</div>
            <div class="row">🎯 Mục tiêu: ${c.goal}</div>
            <br>
            <button class="btn-primary small" data-id="${c.id}">Đăng ký nhận lớp</button>
        `;
        list.appendChild(card);
    });

    // Register buttons
    list.querySelectorAll("button").forEach(btn => {
        btn.onclick = () => {
            if (!currentUser || currentUser.role !== "gia-su") {
                alert("Bạn phải đăng nhập vai trò Gia sư.");
                return;
            }

            requests.push({
                classId: Number(btn.dataset.id),
                tutor: currentUser.username,
                status: "pending"
            });

            save(REQUESTS_KEY, requests);
            alert("Đã gửi yêu cầu!");
            render();
        };
    });
}

/* ====================== TUTOR PAGE ======================= */
function renderTutor() {
    if (!currentUser || currentUser.role !== "gia-su") {
        document.getElementById("tutor-content").innerHTML =
            "<p>Vui lòng đăng nhập vai trò Gia sư.</p>";
        return;
    }

    let reqMe = requests.filter(r => r.tutor === currentUser.username);

    let html = `
        <div class="profile-box">
            <h2>${currentUser.last} ${currentUser.first}</h2>
            <div class="profile-row">⭐ Đánh giá: ${currentUser.rating || "Chưa có"}</div>
            <div class="achievement-box">
                <strong>🎖 Thành tích cá nhân:</strong><br>
                ${currentUser.achievements || "Chưa cập nhật"}
            </div>
            <br>
            <button class="btn-primary small" id="btn-add-ach">Thêm thành tích</button>
        </div>
        <br><br>
        <h3>Các lớp đã đăng ký</h3>
    `;

    reqMe.forEach(r => {
        let c = classes.find(cl => cl.id === r.classId);
        html += `
            <div class="class-card">
                <h3>${c.subject} – ${c.grade}</h3>
                <div class="row">Trạng thái:
                    <span class="status-tag ${r.status}">
                        ${r.status}
                    </span>
                </div>
                ${
                    r.status === "accepted"
                    ? `<button class="btn-primary small" data-pay="${c.id}">Thanh toán phí</button>`
                    : ""
                }
            </div>
        `;
    });

    document.getElementById("tutor-content").innerHTML = html;

    // Add achievements
    const addAchBtn = document.getElementById("btn-add-ach");
    if (addAchBtn) {
        addAchBtn.onclick = () => {
            let text = prompt("Nhập thành tích:");
            if (text) {
                currentUser.achievements = text;
                save(USERS_KEY, users);
                save(CURRENT_KEY, currentUser);
                render();
            }
        };
    }
}

/* ====================== PARENT PAGE ======================= */
function renderParent() {
    if (!currentUser || currentUser.role !== "phu-huynh") {
        document.getElementById("parent-content").innerHTML =
            "<p>Vui lòng đăng nhập vai trò Phụ huynh.</p>";
        return;
    }

    let myClasses = classes.filter(c => c.parent === currentUser.username);
    let reqsForMyClass = requests.filter(r =>
        myClasses.some(c => c.id === r.classId)
    );

    let html = `<h3>Các gia sư ứng tuyển</h3>`;

    reqsForMyClass.forEach(r => {
        let tutor = users.find(u => u.username === r.tutor);
        let c = classes.find(cl => cl.id === r.classId);

        html += `
            <div class="class-card">
                <h3>${c.subject} – ${c.grade}</h3>
                <div>${tutor.last} ${tutor.first}</div>
                <div>Trạng thái: <span class="status-tag ${r.status}">${r.status}</span></div>
                ${
                    r.status === "pending"
                    ? `
                    <button class="btn-primary small" data-accept="${c.id}" data-tutor="${tutor.username}">Chấp nhận</button>
                    <button class="btn-outline small" data-reject="${c.id}" data-tutor="${tutor.username}">Từ chối</button>
                    `
                    : ""
                }
            </div>
        `;
    });

    document.getElementById("parent-content").innerHTML = html;

    // Accept
    document.querySelectorAll("[data-accept]").forEach(btn => {
        btn.onclick = () => {
            let classId = Number(btn.dataset.accept);
            let tutor = btn.dataset.tutor;

            requests.forEach(r => {
                if (r.classId === classId) {
                    r.status = r.tutor === tutor ? "accepted" : "rejected";
                }
            });

            save(REQUESTS_KEY, requests);
            alert("Đã chấp nhận!");
            render();
        };
    });

    // Reject
    document.querySelectorAll("[data-reject]").forEach(btn => {
        btn.onclick = () => {
            let classId = Number(btn.dataset.reject);
            let tutor = btn.dataset.tutor;

            requests.forEach(r => {
                if (r.classId === classId && r.tutor === tutor) {
                    r.status = "rejected";
                }
            });

            save(REQUESTS_KEY, requests);
            alert("Đã từ chối!");
            render();
        };
    });
}

/* ====================== MAIN RENDER ======================= */
function render() {
    renderClasses();
    renderTutor();
    renderParent();
}

refreshNavbar();
render();
