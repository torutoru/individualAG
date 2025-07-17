import NotFoundImage from '../static/img/404.png';

const NotFound = () => {

    return (
        <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
            <img src={NotFoundImage} alt="not found" style={{ width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>
    );
};

export default NotFound;