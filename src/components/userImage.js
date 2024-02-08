import React, { useEffect, useState } from "react";
import { storage, auth } from '../config/firebase'; // Assuming you have imported auth from your firebase config
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import defaultImage from '../images/default.jpg'

function UserImage() {
    const [img, setImg] = useState(null);
    const [lastImgUrl, setLastImgUrl] = useState(null); // Store the URL of the last uploaded image
    const [fileName, setFileName] = useState(""); // Store the name of the selected file
    const [isImageChange, setIsImageChange] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // State to track loading status

    const userId = auth.currentUser ? auth.currentUser.uid : null;

    const defaultPhotoUrl = "https://example.com/default-photo.jpg"; // Replace with your default photo URL

    const handleClick = () => {
        if (img !== null && userId) {
            setIsLoading(true); // Set loading state to true when starting the upload
            const imgRef = ref(storage, `projectFiles/${userId}/${v4()}`);
            uploadBytes(imgRef, img).then((value) => {
                console.log(value);
                getDownloadURL(value.ref).then((url) => {
                    setLastImgUrl(url); // Update lastImgUrl with the URL of the newly uploaded image
                    setIsImageChange(false); // Reset isImageChange to false after successful upload
                    
                    // Delay setting isLoading to false by 1 second (1000 milliseconds)
                    setTimeout(() => {
                        setIsLoading(false); // Set loading state to false after 1 second delay
                    }, 1000);
                });
            });
        }
    };
    

    const handleFileChange = (e) => {
        setImg(e.target.files[0]);
        setFileName(e.target.files[0].name); // Set the name of the selected file
    };

    const uploadImage = () => {
        setIsImageChange(true);
    };

    useEffect(() => {
        if (userId) {
            setIsLoading(true); // Set loading state to true when fetching the image
            listAll(ref(storage, `projectFiles/${userId}`)).then((imgs) => {
                // Get the URL of the last uploaded image
                if (imgs.items.length > 0) {
                    const lastImgRef = imgs.items[imgs.items.length - 1];
                    getDownloadURL(lastImgRef).then((url) => {
                        setLastImgUrl(url);
                    }).catch(error => {
                        console.error("Error getting download URL:", error);
                    }).finally(() => {
                        setIsLoading(false); // Set loading state to false after fetching the image
                    });
                } else {
                    setIsLoading(false); // Set loading state to false if no images are found
                }
            }).catch(error => {
                console.error("Error listing images:", error);
                setIsLoading(false); // Set loading state to false if there's an error listing images
            });
        }
    }, [userId]);

    return (
        <div className="uploadUserImg">
            {lastImgUrl && (
                <div className="userPhotoContainerHome">
                    <img src={lastImgUrl} className="userPhotoHome" alt="Uploaded" />
                    <br />
                </div>
            )}
        </div>
    );
}

export default UserImage;
