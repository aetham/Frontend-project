import './mainmenu.css'
import { Link, Outlet } from 'react-router-dom';

export function MainMenu() {
    return (
        <div>
            <aside className="sidebar">
                <div className="logo">Trinidad Wiseman</div>
                <nav>
                    <ul>
                        <li><Link to='/article'>Artikkel</Link></li>
                        <li><Link to='/table'>Tabel</Link></li>
                    </ul>
                </nav>
            </aside>
            <Outlet />
        </div>
    )
}
export default MainMenu