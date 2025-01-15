//document.getElementById('loginForm')：获取表单元素，loginForm 是表单的 id。
//addEventListener('submit', async function (event) {：给表单添加一个事件监听器，当表单提交时，触发该监听器。async 表示这个函数是异步的
document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // 防止表单默认提交

    //document.getElementById('username').value：获取输入框中用户名的值。
    //document.getElementById('password').value：获取输入框中密码的值。
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        // 发出 POST 请求到 API 网关
            //目标 URL 是 /api/auth/login
            //请求体包含请求体包含用户名和密码
            //await：等待请求的响应，这使得函数暂停执行直到请求完成。
        const response = await axios.post('/api/auth/login', { username, password });

        // 成功响应处理
         //if (response.data.success)：检查响应的 success 字段，判断登录是否成功。
            //alert('Login successful')：登录成功时弹出提示框。
            //localStorage.setItem('token', response.data.token)：将 JWT 令牌存储在 localStorage 中。
            //localStorage.setItem('userName', response.data.user.userName)：将用户名存储在 localStorage 中。
            //window.location.href = '/index'：登录成功后，重定向到主页 /index。
            //document.getElementById('error-message').innerText = response.data.message：登录失败时，将错误消息显示在页面上。
        if (response.data.success) {
            alert('Login successful');
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userName', response.data.user.userName);

            // 显示欢迎消息
            document.getElementById('welcome-message').style.display = 'block';
            document.getElementById('userName').innerText = response.data.user.userName;

            // 隐藏登录表单
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('error-message').innerText = '';
        } else {
            // 登录失败处理
            document.getElementById('error-message').innerText = response.data.message;
        }
    } catch (error) {
        // 请求失败处理
        document.getElementById('error-message').innerText = 'An error occurred. Please try again.';
    }
});
