'use client';

import { useState, useRef, useEffect } from 'react';
import { submitApplication } from '@/app/actions';
import { applicationSchema } from '@/lib/schema';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CustomSelect } from '@/components/ui/CustomSelect';

type FormDataState = {
  full_name: string;
  age: string;
  gender: string;
  city: string;
  phone: string;
  email: string;
  instagram: string;
  tiktok: string;
  facebook: string;
  portfolio_url: string;
  has_ugc_experience: boolean | null;
  preferred_niches: string[];
  languages: string[];
  honeypot: string;
};

export function ApplicationForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  
  const [formData, setFormData] = useState<FormDataState>({
    full_name: '',
    age: '',
    gender: '',
    city: '',
    phone: '',
    email: '',
    instagram: '',
    tiktok: '',
    facebook: '',
    portfolio_url: '',
    has_ugc_experience: null,
    preferred_niches: [],
    languages: [],
    honeypot: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errorCount = Object.keys(errors).length;

  const validateField = (name: keyof FormDataState, value: any) => {
    const result = applicationSchema.shape[name as keyof typeof applicationSchema.shape].safeParse(value);
    setErrors(prev => {
      const next = { ...prev };
      if (!result.success) {
        next[name] = result.error.issues[0].message;
      } else {
        delete next[name];
      }
      return next;
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement> | string) => {
    const name = typeof e === 'string' ? e : e.target.name;
    const value = formData[name as keyof FormDataState];
    
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name as keyof FormDataState, value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { name: string; value: any }) => {
    let name: string;
    let value: any;

    if ('target' in e) {
      name = e.target.name;
      value = e.target.value;
      if (e.target.type === 'select-multiple') {
        const options = (e.target as HTMLSelectElement).options;
        value = Array.from(options).filter(o => o.selected).map(o => o.value);
      }
    } else {
      name = e.name;
      value = e.value;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    setServerError(null);

    if (errors[name]) {
      validateField(name as keyof FormDataState, value);
    }
  };

  const handleRadioChange = (val: boolean) => {
    setFormData(prev => ({ ...prev, has_ugc_experience: val }));
    setServerError(null);
    if (errors.has_ugc_experience) {
      validateField('has_ugc_experience', val);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setServerError(null);

    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    const result = applicationSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(err => {
        if (err.path[0]) {
          fieldErrors[String(err.path[0])] = err.message;
        }
      });
      setErrors(fieldErrors);
      
      const firstErrorName = Object.keys(formData).find(key => fieldErrors[key]);
      if (firstErrorName && formRef.current) {
        const el = formRef.current.querySelector(`[name="${firstErrorName}"]`) as HTMLElement;
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 120;
          window.scrollTo({ top: y, behavior: 'smooth' });
          el.focus();
        }
      }
      setIsSubmitting(false);
      return;
    }

    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => submitData.append(key, v));
      } else if (value !== null && value !== '') {
        submitData.append(key, value.toString());
      }
    });
    
    try {
      const response = await submitApplication(null, submitData);
      if (response?.success) {
        router.push('/success');
      } else {
        setServerError(response?.error || 'We couldn’t submit your application. Your answers are still saved. Please try again.');
        // Scroll to form level error
        const y = formRef.current!.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } catch (err) {
      setServerError('Network error. Your answers are still saved. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputProps = (name: keyof FormDataState) => {
    const hasError = touched[name] && errors[name];
    return {
      name,
      id: name,
      value: formData[name] as string,
      onChange: handleChange,
      onBlur: handleBlur,
      'aria-invalid': !!hasError,
      'aria-describedby': hasError ? `${name}-error` : undefined,
      className: `w-full bg-neutral-950 border rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-1 transition-colors min-h-[44px] ${
        hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-neutral-800 focus:border-[#CCFF00] focus:ring-[#CCFF00]'
      }`
    };
  };

  const renderError = (name: keyof FormDataState) => {
    if (!touched[name] || !errors[name]) return null;
    return (
      <p id={`${name}-error`} className="text-red-400 text-sm mt-1.5" role="alert">
        {errors[name]}
      </p>
    );
  };

  const labelClasses = "block text-sm font-medium text-neutral-400 mb-2";

  return (
    <section id="application-form" className="py-20 md:py-32 bg-black border-t border-neutral-900 overflow-hidden">
      <div className="relative w-full py-6 md:py-8 mb-16 md:mb-24">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-[#CCFF00] origin-left z-0"
        />
        <div className="relative z-20 max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-black mb-2 relative z-20">Creator Application</h2>
            <p className="text-neutral-800 text-lg font-light relative z-20">
              Fill out the form below to apply. Our team reviews every application manually.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 md:space-y-8" noValidate>
            <input type="text" name="honeypot" className="hidden" tabIndex={-1} autoComplete="off" value={formData.honeypot} onChange={handleChange} />

            {/* Error Summary */}
            {errorCount > 0 && Object.keys(touched).length > 0 && (
              <div className="p-4 rounded-lg border border-red-900/50 bg-red-950/20 text-red-400 text-sm font-medium" role="alert" aria-live="polite">
                Please fix {errorCount} {errorCount === 1 ? 'field' : 'fields'} before submitting.
              </div>
            )}
            
            {serverError && (
              <div className="p-4 rounded-lg border border-red-900/50 bg-red-950/20 text-red-400 text-sm font-medium" role="alert" aria-live="assertive">
                {serverError}
              </div>
            )}

            <div className="space-y-6 md:space-y-8">
              <h3 className="text-xl font-medium text-white border-b border-neutral-900 pb-2">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <label htmlFor="full_name" className={labelClasses}>Full Name *</label>
                  <input {...getInputProps('full_name')} type="text" placeholder="Your full name" autoComplete="name" />
                  {renderError('full_name')}
                </div>
                <div>
                  <label htmlFor="age" className={labelClasses}>Age *</label>
                  <input {...getInputProps('age')} type="number" inputMode="numeric" min="16" max="100" placeholder="25" />
                  {renderError('age')}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="relative z-30">
                  <label htmlFor="gender" className={labelClasses}>Gender *</label>
                  <CustomSelect
                    id="gender"
                    name="gender"
                    placeholder="Select gender"
                    options={[
                      { label: 'Male', value: 'male' },
                      { label: 'Female', value: 'female' },
                    ]}
                    value={formData.gender}
                    onChange={(val) => handleChange({ name: 'gender', value: val })}
                    onBlur={() => handleBlur('gender')}
                    error={touched.gender && !!errors.gender}
                    aria-invalid={touched.gender && !!errors.gender}
                    aria-describedby={touched.gender && errors.gender ? "gender-error" : undefined}
                  />
                  {renderError('gender')}
                </div>
                <div>
                  <label htmlFor="city" className={labelClasses}>City *</label>
                  <input {...getInputProps('city')} type="text" placeholder="Your city" autoComplete="address-level2" />
                  {renderError('city')}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <label htmlFor="phone" className={labelClasses}>Phone Number *</label>
                  <input {...getInputProps('phone')} type="tel" placeholder="+20 123 456 7890" autoComplete="tel" />
                  {renderError('phone')}
                </div>
                <div>
                  <label htmlFor="email" className={labelClasses}>Email Address *</label>
                  <input {...getInputProps('email')} type="email" placeholder="email@example.com" autoComplete="email" />
                  {renderError('email')}
                </div>
              </div>
            </div>

            <div className="space-y-6 md:space-y-8 pt-8">
              <h3 className="text-xl font-medium text-white border-b border-neutral-900 pb-2">Social Accounts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <label htmlFor="instagram" className={labelClasses}>Instagram *</label>
                  <input {...getInputProps('instagram')} type="url" placeholder="URL or @handle" autoComplete="url" />
                  {renderError('instagram')}
                </div>
                <div>
                  <label htmlFor="tiktok" className={labelClasses}>TikTok *</label>
                  <input {...getInputProps('tiktok')} type="url" placeholder="URL or @handle" autoComplete="url" />
                  {renderError('tiktok')}
                </div>
                <div>
                  <label htmlFor="facebook" className={labelClasses}>Facebook <span className="text-neutral-600 font-normal">(Optional)</span></label>
                  <input {...getInputProps('facebook')} type="url" placeholder="URL or handle" autoComplete="url" />
                  {renderError('facebook')}
                </div>
              </div>
            </div>

            <div className="space-y-6 md:space-y-8 pt-8">
              <h3 className="text-xl font-medium text-white border-b border-neutral-900 pb-2">Creator Information</h3>
              
              <div>
                <label className={labelClasses}>Have you created UGC before? *</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-3 text-white cursor-pointer min-h-[44px]">
                    <input 
                      type="radio" 
                      name="has_ugc_experience" 
                      checked={formData.has_ugc_experience === true} 
                      onChange={() => handleRadioChange(true)} 
                      onBlur={() => handleBlur('has_ugc_experience')}
                      className="accent-[#CCFF00] w-5 h-5" 
                      aria-invalid={touched.has_ugc_experience && !!errors.has_ugc_experience}
                    /> Yes
                  </label>
                  <label className="flex items-center gap-3 text-white cursor-pointer min-h-[44px]">
                    <input 
                      type="radio" 
                      name="has_ugc_experience" 
                      checked={formData.has_ugc_experience === false} 
                      onChange={() => handleRadioChange(false)} 
                      onBlur={() => handleBlur('has_ugc_experience')}
                      className="accent-[#CCFF00] w-5 h-5" 
                    /> No
                  </label>
                </div>
                {renderError('has_ugc_experience')}
              </div>

              <div>
                <label className={labelClasses}>Preferred Niches *</label>
                <div className="flex flex-wrap gap-3 mt-2">
                  {["Beauty", "Skincare", "Fashion", "Lifestyle", "E-commerce", "Men's Grooming"].map((niche) => {
                    const isSelected = formData.preferred_niches.includes(niche);
                    return (
                      <button
                        key={niche}
                        type="button"
                        onClick={() => {
                          const newSelection = isSelected
                            ? formData.preferred_niches.filter(n => n !== niche)
                            : [...formData.preferred_niches, niche];
                          handleChange({ name: 'preferred_niches', value: newSelection });
                        }}
                        onBlur={() => handleBlur('preferred_niches')}
                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-300 ${
                          isSelected 
                            ? 'bg-[#CCFF00] border-[#CCFF00] text-black shadow-[0_0_15px_rgb(204,255,0,0.3)]' 
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-[#CCFF00]/50 hover:text-white'
                        }`}
                      >
                        {niche}
                      </button>
                    );
                  })}
                </div>
                {renderError('preferred_niches')}
              </div>

              <div>
                <label className={labelClasses}>Languages Spoken *</label>
                <div className="flex flex-wrap gap-3 mt-2">
                  {["Arabic", "English", "French", "Other"].map((lang) => {
                    const isSelected = formData.languages.includes(lang);
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => {
                          const newSelection = isSelected
                            ? formData.languages.filter(l => l !== lang)
                            : [...formData.languages, lang];
                          handleChange({ name: 'languages', value: newSelection });
                        }}
                        onBlur={() => handleBlur('languages')}
                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-300 ${
                          isSelected 
                            ? 'bg-[#CCFF00] border-[#CCFF00] text-black shadow-[0_0_15px_rgb(204,255,0,0.3)]' 
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-[#CCFF00]/50 hover:text-white'
                        }`}
                      >
                        {lang}
                      </button>
                    );
                  })}
                </div>
                {renderError('languages')}
              </div>
            </div>
            
            <div className="space-y-6 md:space-y-8 pt-8">
              <h3 className="text-xl font-medium text-white border-b border-neutral-900 pb-2">Portfolio</h3>
              <div>
                <label htmlFor="portfolio_url" className={labelClasses}>Portfolio URL <span className="text-neutral-600 font-normal">(Optional)</span></label>
                <input {...getInputProps('portfolio_url')} type="url" placeholder="https://yourportfolio.com" autoComplete="url" />
                {renderError('portfolio_url')}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#CCFF00] text-black px-8 py-4 rounded-lg text-lg font-medium hover:bg-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[56px] mt-8"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
