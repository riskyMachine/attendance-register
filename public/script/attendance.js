var checkBoxId = 0
var attendance = []
var names
var date
var select
function addElement(name){
    var element = document.getElementById('form-2')
    var div1 = document.createElement('div')
    div1.setAttribute('class','card-group')
    var div2 = document.createElement('div')
    div2.setAttribute('class','card')
    var div3 = document.createElement('div')
    div3.setAttribute('class','card-body')
    var textNode = document.createTextNode(name)

    element.appendChild(div1)
    div1.appendChild(div2)
    div2.appendChild(div3)
    div3.appendChild(textNode)

    //add checkbox
    var div4 = document.createElement('div')
    div4.setAttribute('class','card')
    var div5 = document.createElement('div')
    div5.setAttribute('class','card-body')
    var input = document.createElement('input')
    input.setAttribute('class','check')
    input.setAttribute('type','checkbox')
    input.setAttribute('id', checkBoxId)
    
    div4.appendChild(div5)
    div5.appendChild(input)
    div1.appendChild(div4)

    checkBoxId++
}

function fetchAttendance(id){
    var checkbox = document.getElementById(id)
    if(checkbox.checked){
        return 1
    }else{
        return 0
    }
}

function selectClasses(name){
    var element = document.getElementById('select')
    var option = document.createElement('option')
    option.setAttribute('value',name)
    var textNode = document.createTextNode(name)
    option.appendChild(textNode)
    element.appendChild(option)
}

function deleteChild() { 
    var el = document.getElementById('form-2');
    var child = el.lastElementChild;  
    while (child) { 
        el.removeChild(child); 
        child = el.lastElementChild; 
    } 
}

function getStudents(){
    deleteChild()
    names = []
    const select = document.getElementById('select').value
    const url = '/allStudent?class=' + select
    fetch(url).then(res => {
        res.json().then(result =>{ 
            for(let el of result){
                names.push(el.name)
            }
            if(names.length!==0){
                names.forEach(el => {
                    addElement(el)
                })
            }
            document.getElementById('submit').style.display = 'inline'
            checkBoxId = 0
            attendance = []
        })
    }).catch(e => {
        console.log(e,'Error Occured in Fetching Students')
    })
}

function getClasses(){
        const names = []
        var response
        fetch('/allClass').then(res => {
            res.json().then(result =>{ 
                response = result 
                for(let el of response){
                    names.push(el.name)
                }
                if(names.length!==0){
                    names.forEach(el => {
                        selectClasses(el)
                    })
                }
                getStudents()
            })
        }).catch(e => {
            console.log('Error Occured in Fetching Classes')
        })
    }

getClasses()
// document.getElementById('select').addEventListener('change',getStudents)
// setTimeout(getStudents,1000)

//Submit attendance
document.getElementById('submit').addEventListener('click', () => {
    for(let i = 0; i< names.length; i++){
        attendance[i] = fetchAttendance(i)
    }
        select = document.getElementById('select').value
    const url = '/attendance?class=' + select

        date = document.getElementById('date').value
    let data = {date,attendance}
    
    fetch(url,{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
})






//Check Date and Set Error

document.getElementById('date').addEventListener('change', () => {
    select = document.getElementById('select').value
    date = document.getElementById('date').value
    if(select){
        fetch('/checkDate',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({date,class: select})
        }).then(res => {
            res.json().then(result => {
                if(result.msg){
                    document.getElementById('error').textContent = result.msg
                    document.getElementById('form-3').style.display = 'none'
                    document.getElementById('form-2').style.display = 'none'
                }else{
                    document.getElementById('error').textContent = result.msg
                    document.getElementById('form-3').style.display = 'block'
                    document.getElementById('form-2').style.display = 'block'               
                }
            })
        })
    }
})
document.getElementById('select').addEventListener('change', () => {
    select = document.getElementById('select').value
    date = document.getElementById('date').value
    if(select){
        fetch('/checkDate',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({date,class: select})
        }).then(res => {
                res.json().then(result => {
                    if(result.msg){
                        document.getElementById('error').textContent = result.msg
                        document.getElementById('form-3').style.display = 'none'
                        document.getElementById('form-2').style.display = 'none'
                    }else{
                        document.getElementById('error').textContent = result.msg
                        document.getElementById('form-3').style.display = 'block'
                        document.getElementById('form-2').style.display = 'block'
                    }
                })
        })
    }
})

