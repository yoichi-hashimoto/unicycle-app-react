import "../common/styles/global.css";

const MainStyle = {
    width: "100%",
    zIndex: 0,
    backgroundColor: "none",
    display: "flex",
    margin: "auto",
}

function Main({ children }) {
    return (
        <div style={MainStyle}>
            {children}
        </div>
    );
}

export default Main;