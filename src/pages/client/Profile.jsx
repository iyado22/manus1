import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { User, Mail, Phone, Calendar, Edit, Save, X } from 'lucide-react'
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { useAuth } from '../../contexts/AuthContext'

const ClientProfile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      full_name: user?.full_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dob: user?.dob || '',
    }
  })

  // Update profile mutation
  const updateProfileMutation = useMutation(
    async (profileData) => {
      // This would connect to your backend API
      const response = await fetch('/api/user/updateProfile.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      })
      return response.json()
    },
    {
      onSuccess: () => {
        toast.success('تم تحديث الملف الشخصي بنجاح!')
        setIsEditing(false)
        queryClient.invalidateQueries('user-profile')
      },
      onError: () => {
        toast.error('فشل في تحديث الملف الشخصي')
      }
    }
  )

  const onSubmit = (data) => {
    updateProfileMutation.mutate(data)
  }

  const handleCancel = () => {
    reset()
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">الملف الشخصي</h1>
          <p className="text-gray-600">إدارة معلوماتك الشخصية</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="card p-6 text-center">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-primary-200" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{user?.full_name}</h2>
              <p className="text-gray-600 mb-4">{user?.email}</p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center justify-center space-x-2 space-x-reverse">
                  <Calendar className="w-4 h-4" />
                  <span>عضو منذ 2024</span>
                </div>
                <div className="flex items-center justify-center space-x-2 space-x-reverse">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>نشط</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Profile Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="card p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">المعلومات الشخصية</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-outline flex items-center space-x-2 space-x-reverse"
                  >
                    <Edit className="w-4 h-4" />
                    <span>تعديل</span>
                  </button>
                ) : (
                  <div className="flex space-x-2 space-x-reverse">
                    <button
                      onClick={handleCancel}
                      className="btn-outline flex items-center space-x-2 space-x-reverse"
                    >
                      <X className="w-4 h-4" />
                      <span>إلغاء</span>
                    </button>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم الكامل
                  </label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...register('full_name', {
                        required: 'الاسم الكامل مطلوب'
                      })}
                      type="text"
                      disabled={!isEditing}
                      className={`input-field pr-12 ${!isEditing ? 'bg-gray-50' : ''} ${errors.full_name ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.full_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...register('email', {
                        required: 'البريد الإلكتروني مطلوب',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'البريد الإلكتروني غير صحيح'
                        }
                      })}
                      type="email"
                      disabled={!isEditing}
                      className={`input-field pr-12 ${!isEditing ? 'bg-gray-50' : ''} ${errors.email ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف
                  </label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...register('phone', {
                        required: 'رقم الهاتف مطلوب'
                      })}
                      type="tel"
                      disabled={!isEditing}
                      className={`input-field pr-12 ${!isEditing ? 'bg-gray-50' : ''} ${errors.phone ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاريخ الميلاد
                  </label>
                  <div className="relative">
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...register('dob')}
                      type="date"
                      disabled={!isEditing}
                      className={`input-field pr-12 ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                {isEditing && (
                  <button
                    type="submit"
                    disabled={updateProfileMutation.isLoading}
                    className="btn-primary w-full py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 space-x-reverse"
                  >
                    {updateProfileMutation.isLoading ? (
                      <LoadingSpinner size="sm" text="" />
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>حفظ التغييرات</span>
                      </>
                    )}
                  </button>
                )}
              </form>
            </div>
          </motion.div>
        </div>

        {/* Account Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <div className="card p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">إحصائيات الحساب</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-200 mb-2">12</div>
                <p className="text-gray-600">إجمالي الحجوزات</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">8</div>
                <p className="text-gray-600">الخدمات المكتملة</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">80</div>
                <p className="text-gray-600">نقاط الولاء</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer/>
    </div>
  )
}

export default ClientProfile