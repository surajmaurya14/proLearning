import { useEffect, useState } from "react";
import InstructorRoute from "../../components/Routes/InstructorRoute";
import InstructorSidebar from "../../components/Sidebars/InstructorSidebar";
import { toast } from "react-toastify";
import axios from "axios";
import stripeBalance from "../../utils-client/stripeBalance";

import { CogIcon } from "@heroicons/react/outline";
const InstructorDashboard = () => {
    const [balance, setBalance] = useState({});
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchBalance = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get("/api/instructor/balance");
                if (data.success === true) {
                    setBalance(data.balance);
                } else {
                    toast.warning("Couldn't fetch balance");
                }
                setLoading(false);
            } catch (err) {
                // console.error(`Error: ${err}`);
                toast.error("Error");
                setLoading(false);
                return;
            }
        };
        fetchBalance();
    }, []);

    return (
        <>
            <InstructorRoute>
                <div className="flex flex-col lg:flex-row">
                    <InstructorSidebar />

                    <div className="lg:w-5/6 p-8">
                        <div className="bg-gray-50 pt-12 sm:pt-16">
                            <div className="max-w-7xl text-sm mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="max-w-4xl mx-auto text-center">
                                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                                        Stripe policy
                                    </h2>
                                    <p className="mt-3 text-gray-500 sm:mt-4">
                                        Your payout schedule refers to how often
                                        Stripe sends money to your bank account.
                                        In India, payouts are always automatic
                                        and daily. In supported countries, your
                                        default payout schedule is daily
                                        automatic. You can change this in the
                                        Dashboard to weekly automatic, monthly
                                        automatic, or manual payouts. When
                                        selecting a weekly or monthly schedule,
                                        you can specify the day of the week or
                                        month that you want payouts to arrive in
                                        your bank account. Selecting a payout
                                        schedule doesn’t change how long it
                                        takes your pending balance to become
                                        available, but it does give you control
                                        over when your funds are paid out. For
                                        example, if your account was operating
                                        on a daily payout schedule with a 3
                                        business day payout speed, the funds
                                        paid out daily would be from 3 business
                                        days preceding. Certain countries have
                                        restrictions on payout schedules: In
                                        Brazil and India, payouts are always
                                        automatic and daily. In Japan, daily
                                        payouts are not available.
                                    </p>
                                    <p className="mt-3 text-gray-500 sm:mt-4">
                                        While payout schedule refers to the
                                        cadence your funds are paid out on (for
                                        example, day of the week), payout speed
                                        refers to the amount of time it takes
                                        for your funds to become available. The
                                        payout speed varies per country and is
                                        typically expressed as T+X days. Some
                                        payment processors may start “T” from
                                        their internal settlement time, meaning
                                        when the funds land in their bank
                                        accounts. At Stripe, we start counting
                                        sooner and “T” refers to transaction
                                        time, meaning the time of initial
                                        payment confirmation or capture. For
                                        example, if your Stripe account is based
                                        in a country with a T+3 standard payout
                                        speed and you’re on a manual payout
                                        schedule, your Stripe balance will be
                                        available to payout within 3 business
                                        days from the time you captured a
                                        payment; if you’re on daily automatic
                                        payout schedule at a T+3 speed, the
                                        funds paid out daily would be from 3
                                        business days preceding. Most banks
                                        deposit payouts into your bank account
                                        as soon as they receive them, though
                                        some may take a few extra days to make
                                        them available. The type of business and
                                        the country you’re in can also affect
                                        payout timing.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-10 pb-12 bg-white sm:pb-16">
                                <div className="relative">
                                    <div className="absolute inset-0 h-1/2 bg-gray-50" />
                                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                        <div className="max-w-4xl mx-auto">
                                            <dl className="rounded-lg bg-white shadow-lg sm:grid sm:grid-cols-3">
                                                <div className="flex flex-col border-b border-gray-100 p-6 text-center items-center sm:border-0 sm:border-r">
                                                    <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                                                        Available
                                                    </dt>
                                                    <dd className="order-1 text-5xl font-extrabold text-indigo-600">
                                                        {loading ? (
                                                            <svg
                                                                className="animate-spin -ml-1 mr-3 h-12 w-12 text-black"
                                                                // xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <circle
                                                                    className="opacity-25"
                                                                    cx="12"
                                                                    cy="12"
                                                                    r="10"
                                                                    stroke="currentColor"
                                                                    strokeWidth="4"
                                                                ></circle>
                                                                <path
                                                                    className="opacity-75"
                                                                    fill="currentColor"
                                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                ></path>
                                                            </svg>
                                                        ) : (
                                                            <>
                                                                {balance &&
                                                                    balance.available &&
                                                                    balance.available.map(
                                                                        (
                                                                            available,
                                                                            index
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    index
                                                                                }
                                                                            >
                                                                                {stripeBalance(
                                                                                    available.amount,
                                                                                    available.currency
                                                                                )}
                                                                            </span>
                                                                        )
                                                                    )}
                                                            </>
                                                        )}
                                                    </dd>
                                                </div>
                                                <div className="flex flex-col items-center border-t border-b border-gray-100 p-6 text-center sm:border-0 sm:border-l sm:border-r">
                                                    <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                                                        Pending Balance
                                                    </dt>
                                                    <dd className="order-1 text-5xl font-extrabold text-indigo-600">
                                                        {loading ? (
                                                            <svg
                                                                className="animate-spin -ml-1 mr-3 h-12 w-12 text-black"
                                                                // xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <circle
                                                                    className="opacity-25"
                                                                    cx="12"
                                                                    cy="12"
                                                                    r="10"
                                                                    stroke="currentColor"
                                                                    strokeWidth="4"
                                                                ></circle>
                                                                <path
                                                                    className="opacity-75"
                                                                    fill="currentColor"
                                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                ></path>
                                                            </svg>
                                                        ) : (
                                                            <>
                                                                {balance &&
                                                                    balance.pending &&
                                                                    balance.pending.map(
                                                                        (
                                                                            pending,
                                                                            index
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    index
                                                                                }
                                                                            >
                                                                                {stripeBalance(
                                                                                    pending.amount,
                                                                                    pending.currency
                                                                                )}
                                                                            </span>
                                                                        )
                                                                    )}
                                                            </>
                                                        )}
                                                    </dd>
                                                </div>
                                                <div className="flex flex-col border-t items-center border-gray-100 p-6 text-center sm:border-0 sm:border-l">
                                                    <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                                                        Stripe Dashboard
                                                    </dt>
                                                    <dd className="order-1 text-5xl font-extrabold text-indigo-600">
                                                        <a
                                                            href="https://dashboard.stripe.com/"
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            <CogIcon
                                                                className="h-12 w-12"
                                                                aria-hidden="true"
                                                            />
                                                        </a>
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </InstructorRoute>
        </>
    );
};

export default InstructorDashboard;
