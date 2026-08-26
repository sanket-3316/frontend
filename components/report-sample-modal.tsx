'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import PhoneInput from 'react-phone-input-2';
import { useDetectedCountry } from '@/hooks/use-detected-country';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    reportId: string | number;
    keyword: string;
    categoryId?: string | number;
    formContent: any;
    formTitle: string;
    getFreeSampleOfThisReport: string;
};

export function ReportSampleModal({
    isOpen,
    onClose,
    reportId,
    keyword,
    categoryId,
    formContent,
    formTitle,
    getFreeSampleOfThisReport,
}: ModalProps) {
    const [loading, setLoading] = useState(false);
    const detectedCountry = useDetectedCountry();
    const [phoneTouched, setPhoneTouched] = useState(false);

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '', // only number part
        countryCode: '91', // default India, replaced once user's country is detected
        designation: '',
        custom_requirements: '',
    });

    // Preselect the user's own country code once detected, unless they've
    // already picked a different one themselves.
    useEffect(() => {
        if (detectedCountry.ready && !phoneTouched) {
            setForm((f) => ({ ...f, countryCode: detectedCountry.dialCode }));
        }
    }, [detectedCountry.ready, detectedCountry.dialCode, phoneTouched]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ✅ Phone change handler (LOCK CODE)
    const handlePhoneChange = (value: string, data: any) => {
        const dialCode = data.dialCode;

        // Remove country code from value → keep only local number
        const numberWithoutCode = value.slice(dialCode.length);

        setPhoneTouched(true);
        setForm({
            ...form,
            phone: numberWithoutCode,
            countryCode: dialCode,
        });
    };

    const validate = () => {
        const errors = formContent.errors;

        if (!form.name) return errors.name_required;
        if (form.name.length < 3) return errors.name_min;

        if (!form.email) return errors.email_required;
        if (!/\S+@\S+\.\S+/.test(form.email)) return errors.email_invalid;

        if (!form.phone) return errors.phone_required;
        if (form.phone.length < 6) return errors.phone_min;

        return null;
    };

    const handleSubmit = async () => {
        const error = validate();

        if (error) {
            toast.error(error);
            return;
        }

        try {
            setLoading(true);

            const res = await fetch('/api/report-sample', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    phone: `+${form.countryCode}${form.phone}`, // ✅ always correct format
                    designation: form.designation,
                    custom_requirements: form.custom_requirements,
                    reportId,
                    categoryId,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || 'Something went wrong');
                return;
            }

            toast.success(formContent.success);
            onClose();
        } catch (err) {
            toast.error('Server error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Toaster position="top-right" />
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">

                <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl p-6">

                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="absolute -top-4 -right-4 gradient-wrapper  text-white rounded-full w-10 h-10 flex items-center justify-center"
                    >
                        ✕
                    </button>

                    {/* Title */}
                    <div className='text-center text-lg font-semibold mb-4'>
                        <Image
                            src={'/images/pdf.png'}
                            alt={`PDF`}
                            width={60}
                            height={60}
                            loading="lazy"
                            className=' justify-self-center'
                        />
                        <h2 className="!my-1">
                            {formTitle}
                        </h2>
                        <h2 className='!my-1'>
                            {getFreeSampleOfThisReport}
                        </h2>
                    </div>

                    <div className="space-y-3">

                        {/* Name */}
                        <input
                            name="name"
                            placeholder={formContent.placeholders.name}
                            className="w-full border rounded-lg px-3 py-2"
                            onChange={handleChange}
                            required={true}
                        />

                        {/* Email */}
                        <input
                            name="email"
                            placeholder={formContent.placeholders.email}
                            className="w-full border rounded-lg px-3 py-2"
                            onChange={handleChange}
                            required={true}
                        />

                        {/* Phone Input */}
                        <PhoneInput
                            country={detectedCountry.iso2}
                            value={`${form.countryCode}${form.phone}`}
                            onChange={handlePhoneChange}
                            enableSearch={true}
                            disableDropdown={false}
                            countryCodeEditable={false} // ✅ THIS IS KEY
                            inputClass="!w-full !h-10 !pl-12 !border !rounded-lg"
                            buttonClass="!border-none"
                            containerClass="!w-full"
                        />

                        {/* Designation (optional) */}
                        <input
                            name="designation"
                            placeholder={formContent.placeholders.designation}
                            className="w-full border rounded-lg px-3 py-2"
                            value={form.designation}
                            onChange={handleChange}
                        />

                        <textarea
                            name="custom_requirements"
                            placeholder={formContent.placeholders.custom_requirements}
                            className="w-full border rounded-lg px-3 py-2"
                            onChange={handleChange}
                            required={true} />
                        {/* Buttons */}
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={onClose}
                                className="w-1/2 border border-gray-300 py-2 rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-1/2 gradient-wrapper  text-white py-2 rounded-lg"
                            >
                                {loading ? 'Loading...' : formContent.submit}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );


}