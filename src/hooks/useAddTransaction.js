import { async } from "@firebase/util"
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import {db} from '../config/firebase';


export const useAddTransaction = () => {
    const transactionCollectionRef = collection(db, "transactions");


    const addTransaction = async ({userID, description, transactionType, trnasactionAmount}) => {
        await addDoc(transactionCollectionRef, {
            userID,
            description,
            trnasactionAmount,
            transactionType,
            createdAt: serverTimestamp(),
        } );
    };

    return{
        addTransaction
    };
}