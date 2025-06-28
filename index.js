let userID;
let index = 0;
let index1 = 0;
let userDatalist = [];
let newArr = [];
(async () => {
    document.getElementById('loadingBody').style=`display: flex;`
    const authenticate = await fetch('https://job-applying-manager.onrender.com/authenticate', {
        method: 'POST',
        credentials: 'include'
    })
    const data = await authenticate.json()
    if (authenticate.ok) {
        userDatalist = data.data;
        console.log(userDatalist)
        userDatalist.forEach(element => {
            newArr.push(`
        <div class="listBodyContent">
            <div onclick="openUserDetails(${index})" class="listRow">
                <p>${element.CompanyName}</p>
                <p class="status" data-status="${element.Status}">${element.Status}</p>  
            </div>
             <div class="rightSide">
                <button type="button" onclick="del(${index++})">x</button>
            </div>
        </div>
            `)
            document.getElementById('listContent').innerHTML += newArr[index1++]
        });

        console.log(newArr)

        document.getElementById('account').style = `display:none`
        document.getElementById('islogin').style = `display:flex`
        document.getElementById('loadingBody').style=`display: none;`
    }
    else if (data.message == "No content available") {
        console.log('eto ngani')
        document.getElementById('account').style = `display:none`
        document.getElementById('islogin').style = `display:flex`
        document.getElementById('loadingBody').style=`display: none;`
    }

    else {
        console.log(data.message)
        document.getElementById('account').style = `display:flex`
        document.getElementById('islogin').style = `display:none`
        document.getElementById('loadingBody').style=`display: none;`
    }
})();


function displayJobList() {
    console.log(userDatalist[index].CompanyName)
    console.log(index)
    newArr.push(`
        <div class="listBodyContent">
            <div onclick="openUserDetails(${index})" class="listRow">
                <p>${userDatalist[index].CompanyName}</p>
                <p class="status" data-status="${userDatalist[index].Status}">${userDatalist[index].Status}</p>  
            </div>
             <div class="rightSide">
                <button type="button" onclick="del(${index++})">x</button>
            </div>
        </div>
            `)
    document.getElementById('listContent').innerHTML += newArr[index1++]


}



const addModal = document.getElementById('modalBody')

function addNew() {
    addModal.style = `display:flex;`
}

function closeAddnew() {
    addModal.style = `display:none;`
}


let selectedInList;

const camponyName = document.getElementById('company')
const position = document.getElementById('position')
const statuss = document.getElementById('status')
const date = document.getElementById('date')


document.getElementById('addModal').addEventListener('submit', (e) => {
    e.preventDefault();
    addtolist()

})
async function addtolist() {
    const addnewjob = await fetch('https://job-applying-manager.onrender.com/addnewjob', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            camponyName: camponyName.value, position: position.value,
            statuss: statuss.value == 'Status' ?
                statuss.value = 'Not Set' : statuss.value, date: date.value
        })
    })
    const data = await addnewjob.json()
    if (addnewjob.ok) {
        let newStatus;
        console.log(data.message)
        if (statuss.value == "") {
            console.log('eto ung sa if else ng status')
            newStatus = 'Not Set'
            console.log(newStatus)
        }
        else {
            newStatus = statuss.value
        }

        userDatalist.push({
            CompanyName: camponyName.value, Position: position.value,
            Status: newStatus, date: date.value
        })
        console.log(userDatalist)
        displayJobList()
        camponyName.value = ''
        position.value = ''
        statuss.value = 'Status'
        date.value = ''
        console.log('nag success????')
        document.getElementById('modalBody').style = `display:none`
    }
    else {
        console.log(data.message)
        document.getElementById('modalBody').style = `display:none`
    }

}
function openUserDetails(index) {
    selectedInList = index
    console.log('test lang', index)
    document.getElementById('userDataListBody').style = `display: flex;`
    document.getElementById('userCompanyName').textContent = userDatalist[index].CompanyName;
    document.getElementById('userPosition').textContent = userDatalist[index].Position;
    document.getElementById('userStatus').textContent = userDatalist[index].Status;
    document.getElementById('userDate').textContent = userDatalist[index].date;
    console.log(document.getElementById('userStatus').textContent)
    document.getElementById('userStatus').className = 'status'
    document.getElementById('userStatus').setAttribute("data-status", userDatalist[index].Status)

}

function closeModal() {
    document.getElementById('userDataListBody').style = `display: none;`
    statusUpdate.value = 'Update'
}


const statusUpdate = document.getElementById('updateStatus')
async function updateStatus() {
    console.log(statusUpdate.value)
    console.log(selectedInList)
    console.log(userDatalist[selectedInList].CompanyName)
    console.log(userDatalist[selectedInList].Position)
    console.log(userDatalist[selectedInList].Status)
    console.log(userDatalist[selectedInList].date)
    const sUpdate = await fetch('https://job-applying-manager.onrender.com/statusUpdate', {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            companyName: userDatalist[selectedInList].CompanyName,
            position: userDatalist[selectedInList].Position,
            statusUpdate: statusUpdate.value == 'Update' ? statusUpdate.value = 'Not Set' :
                statusUpdate.value
        })

    })
    const data = await sUpdate.json()
    if (sUpdate.ok) {
        console.log(data.message)
        let newStatus;
        if (statusUpdate.value == '' || statusUpdate.value == 'Update') {
            newStatus = 'Not Set'
        }
        else {
            newStatus = statusUpdate.value
        }
        userDatalist[selectedInList].Status = newStatus
        openUserDetails(selectedInList)
        console.log(userDatalist[selectedInList].Status)
        newArr[selectedInList] = `
        <div class="listBodyContent">
            <div onclick="openUserDetails(${selectedInList})" class="listRow">
                <p>${userDatalist[selectedInList].CompanyName}</p>
                <p class="status" data-status="${userDatalist[selectedInList].Status}">${userDatalist[selectedInList].Status}</p>  
            </div>
             <div class="rightSide">
                <button type="button" onclick="del(${selectedInList})">x</button>
            </div>
        </div>
        `
        document.getElementById('listContent').innerHTML = newArr.join("")

    }
    else {
        console.log(data.message)
    }
}

const updatedDate = document.getElementById('updatedDate')
async function updateDate() {
    const datUpdate = await fetch('https://job-applying-manager.onrender.com/dateUpdate', {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            companyName: userDatalist[selectedInList].CompanyName,
            position: userDatalist[selectedInList].Position,
            date: updatedDate.value
        })
    })
    const data = await datUpdate.json()
    if (datUpdate.ok) {
        console.log(data.message)
        userDatalist[selectedInList].date = updatedDate.value
        document.getElementById('userDate').textContent = userDatalist[selectedInList].date;
    }
    else {
        console.log(data.message)
    }
}

async function del(index) {
    console.log(index)

    console.log(userDatalist)
    console.log('eto ung idedelet mo ', userDatalist[index].CompanyName)
    console.log('eto ung idedelet mo ', userDatalist[index].Position)
    const deleteList = await fetch('https://job-applying-manager.onrender.com/deleteItem', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            CompanyName: userDatalist[index].CompanyName,
            Position: userDatalist[index].Position
        })
    })
    const data = await deleteList.json()
    if (deleteList.ok) {
        newArr[index] = ""
        document.getElementById('listContent').innerHTML = newArr.join("")
        console.log(data.message)
    }
    else {
        console.log(data.message)
    }

}

async function logout() {
    const logOut = await fetch('https://job-applying-manager.onrender.com/logout', {
        method: 'POST',
        credentials: 'include'
    })
    const data = await logOut.json()
    if (logOut.ok) {
        console.log(data.message)
        document.getElementById('account').style = `display:flex`
        document.getElementById('islogin').style = `display:none`
        window.location.reload()
    }
    else {
        console.log(data.message)
        document.getElementById('account').style = `display:none`
        document.getElementById('islogin').style = `display:flex`
    }
}


let loadingInterval;
function delayLogout() {
    let loadingCount = 0
    document.getElementById('logoutModalBody').style = `display:flex`
    loadingInterval = setInterval(() => {
        loadingCount++
        console.log(loadingCount)
        if (loadingCount >= 5) {
            console.log('tapos na ung load')
            clearInterval(loadingInterval)
            logout()
            document.getElementById('logoutModalBody').style = `display:none`
        }
    }, 1000);


}

function cancelLogout(){
    clearInterval(loadingInterval)
    document.getElementById('logoutModalBody').style = `display:none`
}





