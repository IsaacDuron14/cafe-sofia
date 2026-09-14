import { HomeIcon, MenuIcon, IntelligenceIcon, PulsoIcon, PersonIcon } from './Icons.jsx';

const ITEMS = [
  { nav: 'inicio', label: 'Inicio', view: 'home', Icon: HomeIcon },
  { nav: 'menu', label: 'Menú', view: 'menu', Icon: MenuIcon },
  { nav: 'sofia', label: 'SofIA', view: 'sofia', Icon: IntelligenceIcon },
  { nav: 'pulso', label: 'Pulso', view: 'pulso', Icon: PulsoIcon },
  { nav: 'perfil', label: 'Perfil', view: 'perfil', Icon: PersonIcon },
];

export default function Navbar({ activeGroup, go }) {
  return (
    <div className="navbar">
      {ITEMS.map(({ nav, label, view, Icon }) => (
        <button
          key={nav}
          className={`navbtn ${activeGroup === nav ? 'active' : ''}`}
          data-nav={nav}
          onClick={() => go(view)}
        >
          <Icon />
          {label}
        </button>
      ))}
    </div>
  );
}
