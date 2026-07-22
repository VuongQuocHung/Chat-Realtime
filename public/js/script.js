const registerForm = document.querySelector("#register-form");

if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const fullName = event.target.fullName.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const passwordConfirm = event.target.passwordConfirm.value;

    if (password !== passwordConfirm) {
      notyf.error("Xác nhận mật khẩu không khớp!");
      return;
    }

    const dataFinal = {
      fullName: fullName,
      email: email,
      password: password
    };

    const response = await fetch("/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dataFinal)
    });
    const data = await response.json();

    if (data.code === "error") {
      notyf.error(data.message);
    }

    if (data.code === "success") {
      drawNotyf(data.code, data.message);
      window.location.href = "/user/login";
    }
  });
}

const loginForm = document.querySelector("#login-form");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;
    const rememberPassword = event.target.rememberPassword.checked;

    const dataFinal = {
      email: email,
      password: password,
      rememberPassword: rememberPassword
    };

    const response = await fetch("/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dataFinal)
    });
    const data = await response.json();

    if (data.code === "error") {
      notyf.error(data.message);
    }

    if (data.code === "success") {
      drawNotyf(data.code, data.message);
      window.location.href = "/chat";
    }
  });
}

const logoutForm = document.querySelector("#logout-form");

if (logoutForm) {
  logoutForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const response = await fetch("/user/logout", {
      method: "POST"
    });
    const data = await response.json();

    if (data.code === "success") {
      drawNotyf(data.code, data.message);
      window.location.href = "/";
    }
  });
}
