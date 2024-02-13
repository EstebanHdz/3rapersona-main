let currentLocation = "3rapersona"

let observer
let scrollDirection = ""


let containers

let currentX = 0
let currentY = 0
let targetX = 0
let targetY = 0

let touchPosY


function navigateTo(element, anchor){
    const menu = document.querySelector(".menu");
    const selected = menu.getElementsByClassName("selected");
    selected[0].innerHTML = ""+currentLocation
    selected[0].classList.remove("selected")

    element.classList.add("selected")
    element.innerHTML  = "-"
    currentLocation = anchor
    scrollAction(anchor)
}

function scrollAction(anchor){
    const target = document.getElementById(anchor)
    const scrollable = document.querySelector("#main-container")
    scrollDirection = ""
    scrollable.scroll({
        top:target.offsetTop,
        behavior:'smooth'
    })
}

function start(){

    //SET OBSERVER FOR EVERY CONTAINER ELEMENT
    const targetElements = document.querySelectorAll('.title-page');

    let options = {
        root: document.querySelector("#main-container"),
        //root: null,
        rootMargin: "0px",
        threshold: 0.5,
    };

    observer = new IntersectionObserver(observerCallback, options);
    targetElements.forEach((target) => observer.observe(target))


    window.addEventListener("wheel", (e) => {
        if(e.deltaY < 0){
            scrollDirection = "up"
        }else{
            scrollDirection = "down"
        }
    })

    window.addEventListener("touchstart", (e) => {
        touchPosY  = e.touches[0].clientY;
        
    })

    window.addEventListener("touchmove", (e) => {
        const deltaY = e.touches[0].clientY +-touchPosY;
        
        if(deltaY < 0){
            
            scrollDirection = "down"
        }else{
            scrollDirection = "up"
        }

        touchPosY = e.touches[0].clientY;
    })


    containers = document.querySelectorAll(".title-page")


    const location = window.location.hash
    scrollAction(location.split("#")[1])
    currentLocation = location.split("#")[1]

}




function observerCallback (entries, observer){


    //CHANGE ACTIVE MENU BUTTON DEPENDING ON CURRENT SECTION
    
    if(scrollDirection == "down"){
        const prevSelectedButton = document.getElementById(entries[0].target.id + "-button")
        prevSelectedButton.classList.remove("selected")
        prevSelectedButton.innerHTML = entries[0].target.id

        const newSelectedButton = document.getElementById(entries[1].target.id + "-button")
        newSelectedButton.classList.add("selected")
        newSelectedButton.innerHTML  = "-"
        currentLocation = entries[1].target.id
    }
    if(scrollDirection == "up"){
        const prevSelectedButton = document.getElementById(entries[1].target.id + "-button")
        prevSelectedButton.classList.remove("selected")
        prevSelectedButton.innerHTML = entries[1].target.id

        const newSelectedButton = document.getElementById(entries[0].target.id + "-button")
        newSelectedButton.classList.add("selected")
        newSelectedButton.innerHTML  = "-"
        currentLocation = entries[0].target.id
    }
}

function updateTransparency(){
    containers.forEach(container => {
        const rect = container.getBoundingClientRect();
        const centerPosition = (rect.bottom + rect.top) / 2
        const distanceFromCenter = centerPosition - window.innerHeight / 2


        let opacity = 0
        //const opacity = (-0.8 * normalized * normalized) + (0.8 * normalized) + 0.8
        let scale = 0 
        let rotation = 0

        if(centerPosition > 0 && centerPosition < window.innerHeight){
            
            const normalized = centerPosition / window.innerHeight
            scale = (-0.7 * normalized * normalized) + (0.7 * normalized) + 0.7
            //rotation = ((180 * normalized * normalized) - (180 * normalized) + 45)
            rotation = (-140 * normalized) + 70
        }

        //let scale = 0
        if(distanceFromCenter > 0){
            opacity = (((centerPosition * 100) / -(window.innerHeight / 2)) + 200) / 100
            //rotation = (((centerPosition * 45) / -(window.innerHeight )))
            //scale = (((centerPosition * 100) / -(window.innerHeight / 2)) + 200) / 100
        }else{
            opacity = ((centerPosition * 100) / (window.innerHeight / 2)) / 100
            //rotation = ((centerPosition * 45) / (window.innerHeight))
            //scale = ((centerPosition * 100) / (window.innerHeight / 2)) / 100
        }

        if(distanceFromCenter > 0 && distanceFromCenter < 20){
            //scale = 1
        }



        //gsap.set(progressBarFill, {width:progressBarFillWidth})
        gsap.set(container, {opacity:opacity, scale:scale, rotationX:rotation, transformOrigin:"50% 50%"})
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const interBubble = document.querySelector(".interactive");

    function move() {
        currentX += (targetX - currentX) / 20 
        currentY += (targetY - currentY) / 20 

        interBubble.style.transform = "translate(" + Math.round(currentX) + "px, " + Math.round(currentY) + "px)"
        requestAnimationFrame(() => {
            move()
            updateTransparency()
        })
    }

    window.addEventListener("mousemove", (e) => {
        targetX = e.clientX
        targetY = e.clientY
    })

    move()

})
