import { async } from "@firebase/util"
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import {db} from '../config/firebase';

export const useSendFeedback = () => {
    const feedbackCollectionRef = collection(db, "userfeedback");


    const addFeedback = async ({text}) => {
        await addDoc(feedbackCollectionRef, {
            text
        } );
    };

    return{
        addFeedback
    };
}