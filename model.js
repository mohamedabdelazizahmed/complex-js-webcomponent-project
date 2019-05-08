class Model extends HTMLElement{

    /**
     *  initialize component 
     */
    constructor(){
        super();
        // to use shadow DOM ... 
        this.attachShadow({mode:'open'});
        this.isOpen = false;
        this.shadowRoot.innerHTML = `
        <style>
            #backdrop{
                position:fixed;
                top:0;
                left:0;
                width:100%;
                height:100vh;
                background: rgba(0,0,0,0.75);
                z-index: 10;
                opacity:0;
                pointer-events: none;

            }
            


            #model{
                position: fixed;
                top: 10vh;
                left: 25%;
                width:50%;
             
                z-index: 100;
                background:white;
                border-radius: 3px;
                box-shadow: 0 2px 8px rgb(0,,0,0,0.26);
                  
                display:flex;
                flex-direction: column;
                justify-content:space-between;

                opacity:0;
                pointer-events: none;

                transition: all 0.3s ease-out;

            }

            :host([opened]) #backdrop,
            :host([opened]) #model{
                opacity: 1;
                pointer-events: all;
            }


            :host([opened]) #model{
                top:15vh;
            }


            header {
                 padding: 1rem;
            }

            header h1{
                font-size: 1.25rem;
                border-bottom: 1px solid #ccc;
            }
            ::slotted(h1){
                font-size: 1.25rem;
                margin:0;
            }
            #main{
                padding: 1rem;
            }

            #actions{
                border-top: 1px solid #ccc;
                padding: 1rem;

                display:flex;
                justify-content: flex-end;
            }

            #actions button{
                margin: 0 0.25rem;
            }
        </style>
        <div id="backdrop"></div>
        <div id="model">
            <header>
                <slot name="title"> Confirm Payment as Default title slot</slot>
            </header>
            <section id="main">
                <slot> using multiple  slot using attrubite name in solt Tag && slot in any HTMLELMENT </slot>
            </section>
            <section id="actions">
                    <button id="cancel-btn">Cancel</button>
                    <button id="confirm-btn"> Okay </button>
            </section>
        </div>
        
        `;


        const slots = this.shadowRoot.querySelectorAll('slot');
        slots[1].addEventListener('slotchange',(event)=>{
            console.dir( slots[1]);
            console.dir( slots[1].assignedNodes());

        });
        const backdrop = this.shadowRoot.querySelector("#backdrop");
        const cancelButton = this.shadowRoot.querySelector('#cancel-btn');
        const confirmButton = this.shadowRoot.querySelector('#confirm-btn');


        backdrop.addEventListener('click',this._cancel.bind(this));
        // event handler when click on the cancel  button 
        cancelButton.addEventListener('click', this._cancel.bind(this));
        confirmButton.addEventListener('click', this._confirm.bind(this));
        

        // listen event cancel inside component  [NOT Recomended behavior]
        // cancelButton.addEventListener('cancel' ,()=>{
        //     console.log('Cancel inside  the component ....');
        // });
    }



    /**
     * attributeChangedCallback to react opended attrubite 
     * @param {*} name 
     * @param {*} oldValue 
     * @param {*} newValue 
     */
    attributeChangedCallback(name, oldValue, newValue){
        
        // YOU CAN USE CSS AS METHODS 2 INSTED THIS CODED ....

        if(name === 'opened'){
            if(this.hasAttribute('opened')){
                this.isOpen = true;

                // this.shadowRoot.querySelector("#backdrop").style.opacity = 1;
                // this.shadowRoot.querySelector("#backdrop").style.pointerEvents = 'all';
                // this.shadowRoot.querySelector("#model").style.opacity = 1;
                // this.shadowRoot.querySelector("#model").style.pointerEvents = 'all';
            }
        }else{
            this.isOpen = false;    
        }
    }
    /**
     * to know component have set attribute = opended 
     */
    static get observedAttributes(){
        return ['opened'];
    }

    /**
     *  to set open function as default in object[model]  HTMLELEMENT
     */
    open(){
        this.setAttribute('opened','');
        this.isOpen = true ;
    }

    /**
     * hide model when click cancel button ...
     * 
     */
    hide(){
        if(this.hasAttribute('opened')){
            this.removeAttribute('opened');
        }
        this.isOpen = false;
    }

    /**
     *  cancel the model and hide model function
     * @param event  Dispatch Event cancel after hide function
     */
    _cancel(event){
        this.hide();
        const cancelEvent = new Event('cancel',{bubbles: true, composed: true}); //compposed :[true] => this event my leave the shadow DOM
        event.target.dispatchEvent(cancelEvent);
    }

    _confirm(){
        this.hide();

        const confirmEvent = new Event('confirm');
        // refer the custom element in the end 
        this.dispatchEvent(confirmEvent);
    }

}
customElements.define('uc-model',Model);