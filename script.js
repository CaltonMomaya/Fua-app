    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
    import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

    const firebaseConfig = {
      apiKey: "AIzaSyDV9rLWwVfJ92teYPkXWFALYEqmZO2E4Yk",
      authDomain: "fua-app-a2fb5.firebaseapp.com",
      projectId: "fua-app-a2fb5",
      storageBucket: "fua-app-a2fb5.appspot.com",
      messagingSenderId: "1093221394623",
      appId: "1:1093221394623:web:3d8c8afe038cdacd53be0a",
      measurementId: "G-LCW00REGF8"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const togglePassword = (id, toggleId) => {
      const field = document.getElementById(id);
      const icon = document.getElementById(toggleId);
      icon.onclick = () => {
        field.type = field.type === "password" ? "text" : "password";
        icon.classList.toggle("bx-show");
        icon.classList.toggle("bx-hide");
      };
    };
    togglePassword("password", "passwordToggle");
    togglePassword("confirmPassword", "confirmPasswordToggle");

    const passwordInput = document.getElementById("password");
    const lengthC = document.getElementById("length");
    const capitalC = document.getElementById("capital");
    const symbolC = document.getElementById("symbol");
    const validatePassword = p => {
      const okLen = p.length >= 8;
      const okCap = /[A-Z]/.test(p);
      const okSym = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p);
      lengthC.style.color = okLen ? "green" : "red";
      capitalC.style.color = okCap ? "green" : "red";
      symbolC.style.color = okSym ? "green" : "red";
      return okLen && okCap && okSym;
    };
    passwordInput.addEventListener("input", e => validatePassword(e.target.value));

    const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

    document.getElementById("registerForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const phone = "+254" + document.getElementById("phone").value.trim();
      const userType = document.getElementById("userType").value;
      const email = document.getElementById("email").value.trim();
      const dob = document.getElementById("dob").value;
      const gender = document.querySelector('input[name="gender"]:checked')?.value;

      if (!validatePassword(password)) return alert("Password criteria not met.");
      if (password !== confirmPassword) return alert("Passwords do not match.");

      const otp = generateOTP();
      const validUntil = new Date(Date.now() + 60 * 1000);

      try {
        await emailjs.send("service_lhfe8dg", "template_1h3z4ix", {
          to_email: email,
          to_name: username,
          otp_code: otp,
          valid_until: validUntil.toLocaleTimeString()
        });

        // ✅ Show modal
        const modal = document.getElementById("otpModal");
        modal.classList.add("active");
        const countdown = document.getElementById("countdown");
        const verifyBtn = document.getElementById("verifyOtpBtn");
        const otpInput = document.getElementById("otpInput");
        let remaining = 60;
        const timer = setInterval(() => {
          remaining--;
          const m = String(Math.floor(remaining / 60)).padStart(2, '0');
          const s = String(remaining % 60).padStart(2, '0');
          countdown.textContent = `${m}:${s}`;
          if (remaining <= 0) {
            clearInterval(timer);
            verifyBtn.disabled = true;
            countdown.textContent = "OTP expired!";
          }
        }, 1000);

        verifyBtn.onclick = async () => {
          if (otpInput.value === otp && remaining > 0) {
            clearInterval(timer);
            modal.classList.remove("active");
            await addDoc(collection(db, "users"), {
              username, phone, email, dob, gender, userType, password,
              createdAt: new Date().toISOString()
            });
            alert("✅ Registration successful! You can now login.");
            window.location.href = "mainlog.html";
          } else {
            alert("❌ Incorrect or expired OTP.");
          }
        };
      } catch (error) {
        console.error("Error sending OTP or saving:", error);
        alert("An error occurred. Please try again.");
      }
    });