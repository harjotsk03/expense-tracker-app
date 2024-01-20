import { useEffect, useState } from "react";
import { query, collection, where, orderBy, onSnapshot } from "firebase/firestore";
import { auth, db } from '../config/firebase';

export const useGetTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [totalExpenses, setTotalExpenses] = useState(0.00);
    const [totalIncome, setTotalIncome] = useState(0.00);
    const [balance, setBalance] = useState(0.00);
    const [userID, setUserID] = useState("");
    let unsubscribe;

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setUserID(user.uid);
        }
    }, []);

    const transactionCollectionRef = collection(db, "transactions");

    const getTransactions = async () => {
        try {
            if (userID) {
                const queryTransactions = query(
                    transactionCollectionRef,
                    where("userID", "==", userID),
                    orderBy("createdAt")
                );
    
                unsubscribe = onSnapshot(queryTransactions, (snapshot) => {
                    let docs = [];
                    let expenses = 0;
                    let income = 0;
    
                    snapshot.forEach((doc) => {
                        const data = doc.data();
                        const id = doc.id;
    
                        // Remove the "$" sign and convert to a number
                        const amount = Number(data.trnasactionAmount.replace('$', ''));
    
                        docs.push({ ...data, id, trnasactionAmount: amount });
    
                        if (data.transactionType === 'expense') {
                            expenses += amount;
                        } else {
                            income += amount;
                        }
                    });
    
                    // Calculate total balance after processing all transactions
                    const balanceTotal = income - expenses;
                    setBalance(balanceTotal);

                    setTransactions(docs);
                    setTotalExpenses(expenses);
                    setTotalIncome(income);
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getTransactions();
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [userID]);

    return { transactions, transactionIds: transactions.map(transaction => transaction.id), totalExpenses, totalIncome, balance };
};
