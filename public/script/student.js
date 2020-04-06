function addElement(name){
    var element = document.getElementById('form-2')
    var div1 = document.createElement('div')
    div1.setAttribute('class','card')
    var div2 = document.createElement('div')
    div2.setAttribute('class','card-body')
    var textNode = document.createTextNode(name)
    element.appendChild(div1)
    div1.appendChild(div2)
    div2.appendChild(textNode)
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
    const names = []
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
document.getElementById('select').addEventListener('change',getStudents)
// getStudents()
// setTimeout(getStudents,1000)