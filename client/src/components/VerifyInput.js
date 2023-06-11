const inputs = document.querySelectorAll("input");
const input = document.querySelector("input");

inputs.forEach((input,index1) => {
    input.addEventListener("keyup" , (e) => {
        const currentInput = input , 
        nextInput = input.nextElementSibling,
        pervInput = input.previousElementSibling;

        if(currentInput.value.length > 1)
        {
            currentInput.value ="";
            return ;
        }

        if (nextInput && nextInput.hasAttribute("disabled") && currentInput.value !=="" )
        {
            nextInput.removeAttribute("disabled");
            nextInput.focus();
        }
        if (e.key ==="Backspace"){
            inputs.forEach((input,index2) =>{
                if(index1 <= index2 && pervInput){
                    input.setAttribute("disabled" , true);
                    currentInput.value="";
                    pervInput.focus();
                }
            });
        }
        
    });
});
//foucs the first input which index is 0 on window load
//window.addEventListener("load", () => inputs[0].focus());

