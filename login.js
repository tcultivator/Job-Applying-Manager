

const username = document.getElementById('username')
const password = document.getElementById('password')

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault()
    console.log(username.value)
    console.log(password.value)
    const login = await fetch('https://job-applying-manager.onrender.com/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username.value, password: password.value })
    })
    const data = await login.json()
    if (login.ok) {
        console.log(data.message)
        document.getElementById('notifbody').style = `display:flex; background-color: rgb(66, 226, 146);`
        document.getElementById('message').textContent = data.message
        setTimeout(() => {
            document.getElementById('notifbody').style = `display:none`
            window.location.replace('index.html')
        }, 1500);

    }
    else {
        console.log(data.message)
        document.getElementById('notifbody').style = `display:flex;background-color: rgb(219, 71, 71);`
        document.getElementById('message').textContent = data.message
        setTimeout(() => {
            document.getElementById('notifbody').style = `display:none`
        }, 1500);
    }
})
