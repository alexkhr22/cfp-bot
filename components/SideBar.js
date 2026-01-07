import config from "@/config";

const SideBar = () =>{
    return (
    
    <div className="rechteck-sidebar">
        <button className="sidebar-btn">Home</button>
        <div className="tagsp-div">
            <p className="tags-p">Meine Tags:</p>
        </div>
        <div className="home-dropdown">
            <ul className="scroll-list">
                <li>Eintrag 1</li>
                <li>Eintrag 2</li>
                <li>Eintrag 3</li>
                <li>Eintrag 4</li>
                <li>Eintrag 5</li>
                <li>Eintrag 6</li>
                <li>Eintrag 7</li>
                <li>Eintrag 8</li>
            </ul>
        </div>
        <div className="newtag-div">
            <input className="tag-input" type="text" placeholder="Neuer Tag" />
            <button className="newtag-btn">+</button>
        </div>
        <button className="sidebar-btn">Neue Gruppe</button>
        <button className="sidebar-btn">Gruppen</button>
    </div>
        
    ); 


};

export default SideBar;