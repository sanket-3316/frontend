"use client";

import { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import FormField from "@/components/ui/FormField";
import { useDetectedCountry } from "@/hooks/use-detected-country";
import {
  FiUser,
  FiMail,
  FiBriefcase,
  FiHome,
  FiMessageSquare,
} from "react-icons/fi";

type FormState = {
  name: string;
  email: string;
  phone: string; // local number only, without dial code
  countryCode: string; // dial code, e.g. "91"
  job: string;
  company: string;
  message: string;
  captcha: string;
};

export default function ContactForm({ content }: { content: any }) {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    countryCode: "91",
    job: "",
    company: "",
    message: "",
    captcha: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [captcha] = useState("2608");
  const [success, setSuccess] = useState(false);
  const detectedCountry = useDetectedCountry();
  const [phoneTouched, setPhoneTouched] = useState(false);

  // Preselect the user's own country code once detected, unless they've
  // already picked a different one themselves.
  useEffect(() => {
    if (detectedCountry.ready && !phoneTouched) {
      setForm((prev) => ({ ...prev, countryCode: detectedCountry.dialCode }));
    }
  }, [detectedCountry.ready, detectedCountry.dialCode, phoneTouched]);

  const update = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePhoneChange = (value: string, data: any) => {
    const dialCode = data.dialCode;
    const numberWithoutCode = value.slice(dialCode.length);

    setPhoneTouched(true);
    setForm((prev) => ({
      ...prev,
      phone: numberWithoutCode,
      countryCode: dialCode,
    }));
  };

  const validate = () => {
    let e: Record<string, string> = {};
    const v = content.validation;

    if (v.name.required && !form.name)
      e.name = content.errors.name_required;
    else if (form.name.length < v.name.min)
      e.name = content.errors.name_min;

    if (!form.email)
      e.email = content.errors.email_required;
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      e.email = content.errors.email_invalid;

    if (!form.phone)
      e.phone = content.errors.phone_required;
    else if (form.phone.length < v.phone.min)
      e.phone = content.errors.phone_min;

    if (!form.message)
      e.message = content.errors.message_required;

    if (form.captcha !== captcha)
      e.captcha = content.errors.captcha_required;

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSuccess(true);
    setForm({
      name: "",
      email: "",
      phone: "",
      countryCode: detectedCountry.dialCode,
      job: "",
      company: "",
      message: "",
      captcha: "",
    });
    setPhoneTouched(false);

    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className=" p-6 md:p-10 ">

      <h2 className="text-2xl font-bold text-center">
        {content.title}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-1">

        <FormField
          label={content.labels.name}
          placeholder={content.placeholders.name}
          value={form.name}
          onChange={(v) => update("name", v)}
          required={content.validation.name.required}
          error={errors.name}
          icon={<FiUser />}
        />

        <FormField
          label={content.labels.email}
          placeholder={content.placeholders.email}
          value={form.email}
          onChange={(v) => update("email", v)}
          required
          error={errors.email}
          icon={<FiMail />}
          type="email"
        />

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            {content.labels.phone} <span className="text-red-500">*</span>
          </label>

          <PhoneInput
            country={detectedCountry.iso2}
            value={`${form.countryCode}${form.phone}`}
            onChange={handlePhoneChange}
            enableSearch
            disableDropdown={false}
            countryCodeEditable={false}
            inputClass="!w-full !h-10 !pl-12 !border !rounded-lg"
            buttonClass="!border-none"
            containerClass="!w-full"
          />

          {errors.phone && <p className="!text-red-500 !text-sm">{errors.phone}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            label={content.labels.job}
            placeholder={content.placeholders.job}
            value={form.job}
            onChange={(v) => update("job", v)}
            icon={<FiBriefcase />}
          />

          <FormField
            label={content.labels.company}
            placeholder={content.placeholders.company}
            value={form.company}
            onChange={(v) => update("company", v)}
            icon={<FiHome />}
          />
        </div>

        <FormField
          label={content.labels.message}
          placeholder={content.placeholders.message}
          value={form.message}
          onChange={(v) => update("message", v)}
          required
          error={errors.message}
          icon={<FiMessageSquare />}
          type="textarea"
        />

        

        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded">
            {content.success}
          </div>
        )}

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
          {content.submit}
        </button>

      </form>
    </div>
  );
}