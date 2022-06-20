class Tooltip {

    tooltipElement;

    constructor(itemElement) {
        this.tooltipElement = document.createElement('div');
        this.tooltipElement.className = 'card';
        this.tooltipElement.textContent = "Dummy!";
        this.tooltipElement.addEventListener('click', this.hide.bind(this));
        this.itemElement = itemElement;
    }

    hide() {

        this.tooltipElement.remove();

    }

    setText(text) {
        this.tooltipElement.textContent = text;
    }

    updatePosition() {
        const hostElPosLeft = this.itemElement.offsetLeft;
        const hostElPosTop = this.itemElement.offsetTop;
        const hostElHeight = this.itemElement.clientHeight;
        const parentScrollProgress = this.itemElement.parentElement.scrollTop;

        const x = hostElPosLeft + 20;
        const y = hostElPosTop + hostElHeight - parentScrollProgress - 10;

        this.tooltipElement.style.position = 'absolute';
        this.tooltipElement.style.left = x + 'px';
        this.tooltipElement.style.top = y + 'px';
    }

    show() {

        this.updatePosition();
        document.body.append(this.tooltipElement);

    }
}

class ProjectItem {

    projectList; // Stores the list Object this item is apart of.
    toolTip; // Stores the object that controls the info tool tip.
    projectItemElement; // Stores a reference to the DOM element that displays this item
    id; // Stores the HTML id of this item.

    constructor(id, projectList) {
        this.id = id;
        this.projectList = projectList;

        this.projectItemElement = document.getElementById(this.id);

        this.toolTip = new Tooltip(this.projectItemElement);
        this.connectSwitchButton();
        this.connectMoreInfoButton();
    }

    setProjectList(projectList)
    {

        this.projectList = projectList;
        const switchBtn = this.getSwitchButton();
        switchBtn.textContent = projectList.type === 'active' ? 'Finish' : 'Activate';

    }

    infoHandler() {
        this.toolTip.show();
    }

    connectMoreInfoButton() {
        const infoButton = this.getInfoButton();
        infoButton.addEventListener('click', this.infoHandler.bind(this));

        const projectItemElement = document.getElementById(this.id);
        this.toolTip.setText(projectItemElement.dataset.extraInfo);

    }

    switchHandler() {
        this.projectList.switchProject(this);
    }

    getInfoButton() {
        const infoButton = this.projectItemElement.querySelector(`button:first-of-type`); 
        return infoButton;
    }

    getSwitchButton () {
        const switchBtn = this.projectItemElement.querySelector('button:last-of-type');
        return switchBtn;
    }

    connectSwitchButton() {
        
        const switchBtn = this.getSwitchButton();
        switchBtn.addEventListener('click', this.switchHandler.bind(this)); //Switch the element from a project list into another.
        
    }

}

class ProjectList {

    projects = [];

    constructor(type) {
        this.type = type;
        //The type of project list will only work with 'active' or 'finished'
        const projectItems = document.querySelectorAll(`#${type}-projects li`); // Get all the list items in one of the project lists
        for (const item of projectItems)
        {

            this.projects.push(new ProjectItem(item.id, this)); // Create an object for each project

        }

    }

    addProject(project)  
    {
        this.projects.push(project);
        project.setProjectList(this);
        DOMHelper.moveElement(project.id, `#${this.type}-projects ul`);
    }

    switchProject(project) {
        
        this.projects = this.projects.filter(p => p !== project); // Remove the target project
        App.moveProject(project, this); // Add the target project to the other list.

    }   

}

class DOMHelper {
    static moveElement(elementId, newDestinationSelector)
    {

        const element = document.getElementById(elementId);
        const destinationElement = document.querySelector(newDestinationSelector);
        destinationElement.append(element);
        element.scrollIntoView({behavior: 'smooth'}); // Scroll to the element that was just moved to the new list. Make the animation smooth instead of instantaneous.

    }
}

class App {

    static activeList;
    static finishedList;

    static init() {
        this.activeList = new ProjectList('active');
        this.finishedList = new ProjectList('finished');


        /*
        The following code is an example of creating a script dynamically.
        This application isn't useful, a more useful  application would be loading a script after a user interaction.
        */
        const someScript = document.createElement(`script`);
        someScript.textContent = `alert("Some Script")`;

        document.head.append(someScript);

        //This method will run another script
        //this.startAnalytics();

        //This code executes a method which performs a delayed method.
        const timer = setTimeout(this.startAnalytics, 3000);

        //There is a way to stop the timer
        //clearTimeout(timer);

    }

    static startAnalytics() 
    {

        const analyticsScript = document.createElement('script');
        analyticsScript.src = `assets/scripts/analytics.js`;
        analyticsScript.defer = true;

        document.head.append(analyticsScript);

    }

    static moveProject(project, fromProjectList)
    {
  
        if(fromProjectList === this.activeList)
            this.finishedList.addProject(project);
        else
            this.activeList.addProject(project);

    }

}

App.init();
