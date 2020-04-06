var viewClassBoolean = true
var addClassFormBoolean = true

function addClassForm(){
    if(addClassFormBoolean){
        var element = document.getElementById('form-1')
        element.setAttribute('class','form-group')
        element.setAttribute('action','/class')
        element.setAttribute('method','POST')
        var label = document.createElement('label')
        var labelText = document.createTextNode('Class Name')
        label.appendChild(labelText)
        element.appendChild(label)
        var input = document.createElement('input')
        input.setAttribute('class', 'form-control')
        input.setAttribute('name','name')
        element.appendChild(input)
        
        var submit = document.createElement('button')
        var submitText = document.createTextNode('Add Class')
        submit.setAttribute('type','submit')
        submit.setAttribute('class','btn btn-primary')
        submit.setAttribute('id','submit')
        submit.appendChild(submitText)
        element.appendChild(submit)
        addClassFormBoolean = false
    }
}

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

function getClasses(){
    if(viewClassBoolean){
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
                        addElement(el)
                    })
                    viewClassBoolean = false
                }
            })
        }).catch(e => {
            console.log('Error Occured in Fetching')
        })
    }
}

addClassForm()
getClasses()