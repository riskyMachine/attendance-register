
function addElement(name, attn){
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


    //Add 2nd Card
    var div4 = document.createElement('div')
    div4.setAttribute('class','card')
    var div5 = document.createElement('div')
    div5.setAttribute('class','card-body')
    var textNode1 = document.createTextNode(attn)
    
    div4.appendChild(div5)
    div5.appendChild(textNode1)
    div1.appendChild(div4)
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
    var names = []
    const select = document.getElementById('select').value
    const url = '/viewAttendance'
    const date = document.getElementById('date').value
    fetch(url,{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({class : select , date})
    }).then(res => {
        res.json().then(result =>{ 
            for(var el of result){
                addElement(el.name,el.present === true ? 'Present' : 'Absent')
            }
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
            })
        }).catch(e => {
            console.log('Error Occured in Fetching Classes')
        })
    }

getClasses()
document.getElementById('submit').addEventListener('click',getStudents)