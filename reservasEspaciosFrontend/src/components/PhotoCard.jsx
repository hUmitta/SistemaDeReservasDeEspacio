function PhotoCard({ imageSrc, name }) {
    return (
        <div>
            <img src={imageSrc} alt={name} style={{ width: "100%", height: "auto" }} />
            <h3>{name}</h3>
        </div>
    );
}

export default PhotoCard;
