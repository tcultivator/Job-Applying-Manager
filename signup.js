const username = document.getElementById('username')
const password = document.getElementById('password')


document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault()
    const signup = await fetch('http://127.0.0.1:8080/signup', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username.value, password: password.value })
    })
    const data = await signup.json()
    if (signup.ok) {
        console.log(data.message)
        document.getElementById('notifbody').style = `display:flex; background-color: rgb(66, 226, 146);`
        document.getElementById('message').textContent = data.message
        setTimeout(() => {
            document.getElementById('notifbody').style = `display:none`
            window.location.replace('login.html')
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