// === 🔥 Firebase Config ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDV9rLWwVfJ92teYPkXWFALYEqmZO2E4Yk",
  authDomain: "fua-app-a2fb5.firebaseapp.com",
  projectId: "fua-app-a2fb5",
  storageBucket: "fua-app-a2fb5.firebasestorage.app",
  messagingSenderId: "1093221394623",
  appId: "1:1093221394623:web:3d8c8afe038cdacd53be0a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// === 📧 EmailJS Config ===
(function() {
  emailjs.init("MGI62By2LOWVwfjYc"); // from EmailJS Dashboard
})();

// === Helper: Firestore Email Check ===
async function checkUserEmail(email) {
  const q = query(collection(db, "users"), where("email", "==", email));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    return { exists: true, userId: userDoc.id, data: userDoc.data() };
  } else {
    return { exists: false };
  }
}

// === Helper: Update User Password ===
async function updateUserPassword(userId, newPassword) {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { password: newPassword });
}

// === UI Elements ===
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");
const successMessage = document.getElementById("successMessage");
const loadingSpinner = document.getElementById("loadingSpinner");

const emailForm = document.getElementById("emailForm");
const codeForm = document.getElementById("codeForm");
const passwordForm = document.getElementById("passwordForm");

let generatedOtp = null;
let userId = null;

// === Step 1: Verify Email ===
emailForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();

  if (!email) {
    alert("Please enter your email address.");
    return;
  }

  const generatedOtp = Math.floor(100000 + Math.random() * 900000);

  try {
    console.log("📧 Sending OTP to:", email);

    await emailjs.send("service_rgh35fn", "template_6buhlym", {
      to_email: email,             // ✅ Matches template
      otp_code: generatedOtp,      // ✅ Matches template
      from_name: "Fua Konnect Support", // ✅ Matches template
    });

    console.log("✅ OTP email sent successfully!");
    alert("OTP sent successfully! Check your inbox.");

    // Save OTP for verification later
    sessionStorage.setItem("resetEmail", email);
    sessionStorage.setItem("resetOtp", generatedOtp);

  } catch (error) {
    console.error("❌ Failed to send email:", error);
    alert("❌ Failed to send OTP. Please check your EmailJS configuration.");
  }
});


// === Step 2: Verify OTP ===
codeForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const enteredCode = Array.from(document.querySelectorAll(".code-input"))
    .map((input) => input.value)
    .join("");

  const correctOtp = sessionStorage.getItem("resetOtp");

  if (enteredCode === correctOtp) {
    alert("✅ OTP verified successfully!");
    step2.classList.remove("active");
    step3.classList.add("active");
  } else {
    alert("❌ Incorrect OTP. Please check your email and try again.");
  }
});

// === Step 3: Reset Password ===
passwordForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newPassword = document.getElementById("newPassword").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  if (newPassword !== confirmPassword) {
    alert("❌ Passwords do not match!");
    return;
  }

  const userId = sessionStorage.getItem("userId");

  try {
    loadingSpinner.style.display = "flex";
    await updateUserPassword(userId, newPassword);
    loadingSpinner.style.display = "none";

    step3.classList.remove("active");
    successMessage.style.display = "block";
    alert("✅ Password reset successful! You can now login.");
  } catch (error) {
    console.error("Password update failed:", error);
    loadingSpinner.style.display = "none";
    alert("❌ Error updating password. Try again.");
  }
});

// === Optional: Code input UX ===
document.querySelectorAll(".code-input").forEach((input, index, arr) => {
  input.addEventListener("input", () => {
    if (input.value && index < arr.length - 1) arr[index + 1].focus();
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && index > 0 && !input.value) arr[index - 1].focus();
  });
});
