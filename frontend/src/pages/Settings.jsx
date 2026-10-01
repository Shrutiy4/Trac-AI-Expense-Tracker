import React, { useEffect, useState } from 'react';
import {
  LogOut,
  Bell,
  Lock,
  Settings as GearIcon,
  Sun,
  User,
  Pencil
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import api from '../lib/axios';

const Settings = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "halloween");
  const [currency, setCurrency] = useState(localStorage.getItem("currency") || "INR");

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [userInfo, setUserInfo] = useState({ username: '', email: '' });
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    const fetchUserInfo = async () => {
      try {
        const res = await api.get('/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserInfo(res.data);
        if (res.data.currency) {
          setCurrency(res.data.currency); // Set currency from backend
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to fetch user info');
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const newTheme = isDark ? 'halloween' : 'autumn';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem("theme", newTheme);

    const token = localStorage.getItem("token");
    // api.put('/user/settings/theme', { theme: newTheme }, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // }).catch((err) => {
    //   toast.error('Theme update failed');
    // });
  }, [isDark]);

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setCurrency(newCurrency);
    localStorage.setItem("currency", newCurrency); // ✅ Save in localStorage

    const token = localStorage.getItem("token");
    api.put('/user/settings/currency', { currency: newCurrency }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).catch((err) => {
      toast.error('Currency update failed');
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const verifyOldPassword = async () => {
    const token = localStorage.getItem("token");
    try {
      await api.post('/user/verify-password', { oldPassword }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Old password verified!");
      setStep(2);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Incorrect old password");
    }
  };

  const updateNewPassword = async () => {
    const token = localStorage.getItem("token");
    try {
      await api.put('/user/change-password', {
        oldPassword,
        newPassword,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Password updated successfully!");
      setShowPasswordModal(false);
      setStep(1);
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      toast.error(err?.response?.data?.message || "Password change failed");
    }
  };

  const settings = [
    {
      title: 'Theme',
      description: 'Light / Dark mode',
      icon: <Sun className="text-warning" size={20} />,
      action: (
        <input
          type="checkbox"
          className="toggle toggle-sm toggle-primary"
          checked={isDark}
          onChange={() => setIsDark(!isDark)}
        />
      ),
    },
    {
      title: 'Preferred Currency',
      description: 'Set your default currency',
      icon: <GearIcon className="text-success" size={20} />,
      action: (
        <select
          className="select select-xs select-success w-20 md:w-40"
          value={currency}
          onChange={handleCurrencyChange}
        >
          <option value="INR">₹ INR – Indian Rupee</option>
          <option value="USD">$ USD – US Dollar</option>
          <option value="EUR">€ EUR – Euro</option>
          <option value="GBP">£ GBP – British Pound</option>
          <option value="JPY">¥ JPY – Japanese Yen</option>
          <option value="AUD">$ AUD – Australian Dollar</option>
          <option value="CAD">$ CAD – Canadian Dollar</option>
          <option value="CHF">CHF – Swiss Franc</option>
          <option value="CNY">¥ CNY – Chinese Yuan</option>
          <option value="SGD">$ SGD – Singapore Dollar</option>
          <option value="NZD">$ NZD – New Zealand Dollar</option>
          <option value="ZAR">R ZAR – South African Rand</option>
          <option value="SEK">kr SEK – Swedish Krona</option>
          <option value="NOK">kr NOK – Norwegian Krone</option>
          <option value="BRL">R$ BRL – Brazilian Real</option>
          <option value="RUB">₽ RUB – Russian Ruble</option>
          <option value="MXN">$ MXN – Mexican Peso</option>
          <option value="HKD">$ HKD – Hong Kong Dollar</option>
          <option value="KRW">₩ KRW – South Korean Won</option>
          <option value="TRY">₺ TRY – Turkish Lira</option>
          <option value="THB">฿ THB – Thai Baht</option>
          <option value="IDR">Rp IDR – Indonesian Rupiah</option>
          <option value="MYR">RM MYR – Malaysian Ringgit</option>
          <option value="PHP">₱ PHP – Philippine Peso</option>
          <option value="VND">₫ VND – Vietnamese Dong</option>
          <option value="PLN">zł PLN – Polish Złoty</option>
          <option value="DKK">kr DKK – Danish Krone</option>
          <option value="HUF">Ft HUF – Hungarian Forint</option>
          <option value="CZK">Kč CZK – Czech Koruna</option>
          <option value="AED">د.إ AED – UAE Dirham</option>
          <option value="SAR">﷼ SAR – Saudi Riyal</option>
          <option value="EGP">£ EGP – Egyptian Pound</option>
          <option value="NGN">₦ NGN – Nigerian Naira</option>
          <option value="PKR">₨ PKR – Pakistani Rupee</option>
          <option value="BDT">৳ BDT – Bangladeshi Taka</option>
          <option value="LKR">Rs LKR – Sri Lankan Rupee</option>
          <option value="KWD">د.ك KWD – Kuwaiti Dinar</option>
          <option value="QAR">ر.ق QAR – Qatari Riyal</option>
          <option value="MAD">د.م MAD – Moroccan Dirham</option>
        </select>
      ),
    },
    {
      title: 'Change Password',
      description: 'Update login password',
      icon: <Lock className="text-error" size={20} />,
      action: (
        <button
          className="btn btn-xs btn-outline btn-error"
          onClick={() => setShowPasswordModal(true)}
        >
          Change
        </button>
      ),
    },
    {
      title: 'Logout',
      description: 'Sign out of your account',
      icon: <LogOut className="text-secondary" size={20} />,
      action: (
        <button
          className="btn btn-xs btn-outline btn-secondary"
          onClick={handleLogout}
        >
          Logout
        </button>
      ),
    },
    {
      title: 'Delete Account',
      description: 'Permanently delete your account and data',
      icon: <User className="text-error" size={20} />,
      action: (
        <button
          className="btn btn-xs btn-outline btn-error"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete
        </button>
      ),
    },

  ];

  const handleEditClick = (field) => {
    setEditingField(field);
    setTempValue(userInfo[field]);
  };

  const handleSaveEdit = async (field) => {
    const token = localStorage.getItem('token');
    try {
      const res = await api.put('/user/profile', {
        [field]: tempValue
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(res.data);
      setEditingField(null);
      toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`);
    } catch (err) {
      toast.error(err?.response?.data?.message || `Failed to update ${field}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setTempValue('');
  };

  return (
    <div className="min-h-full bg-base-200 p-4 sm:p-6">
      <Toaster position="top-center" />
      <h1 className="text-center lg:text-left text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-4">SETTINGS</h1>

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4">
        <div className="card bg-base-100 shadow-sm py-6 flex items-center justify-center text-center">
          <div className="flex flex-col items-center space-y-2 w-full px-4">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center">
              <User size={35} />
            </div>
            
            {/* Username with edit option */}
            <div className="flex items-center gap-0">
              {editingField === 'username' ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className="input input-sm input-bordered w-[80%] text-center"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                  />
                  <button 
                    className="btn btn-circle btn-success btn-xs"
                    onClick={() => handleSaveEdit('username')}
                  >
                    ✓
                  </button>
                  <button 
                    className="btn btn-circle btn-error btn-xs"
                    onClick={handleCancelEdit}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-md font-semibold">{userInfo.username}</h2>
                  <button 
                    className="btn btn-circle btn-ghost btn-xs"
                    onClick={() => handleEditClick('username')}
                  >
                    <Pencil size={12} />
                  </button>
                </>
              )}
            </div>
            
            {/* Email with edit option */}
            <div className="flex items-center gap-0">
              {editingField === 'email' ? (
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    className="input input-sm input-bordered w-[80%] text-center"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                  />
                  <button 
                    className="btn btn-circle btn-success btn-xs"
                    onClick={() => handleSaveEdit('email')}
                  >
                    ✓
                  </button>
                  <button 
                    className="btn btn-circle btn-error btn-xs"
                    onClick={handleCancelEdit}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-base-content/70">{userInfo.email}</p>
                  <button 
                    className="btn btn-circle btn-ghost btn-xs"
                    onClick={() => handleEditClick('email')}
                  >
                    <Pencil size={12} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          {settings.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-base-100 p-3 rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <div className="text-md">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm text-base-content/70">{item.description}</div>
                </div>
              </div>
              {item.action}
            </div>
          ))}
        </div>
      </div>

      {showPasswordModal && (
        <div open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-2">Change Password</h3>
            {step === 1 ? (
              <>
                <label className="label">Enter your current password</label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Old password"
                />
                <div className="modal-action">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={verifyOldPassword}
                  >
                    Next
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setStep(1);
                      setOldPassword('');
                      setNewPassword('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <label className="label">Enter new password</label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                />
                <div className="modal-action">
                  <button
                    className="btn btn-success btn-sm"
                    onClick={updateNewPassword}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setStep(1);
                      setOldPassword('');
                      setNewPassword('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-error mb-3">Confirm Account Deletion</h3>
            <p className="mb-4 text-sm text-base-content/70">
              This action is <strong>permanent</strong> and will delete all your data including expenses and groups. Are you sure?
            </p>
            <div className="modal-action">
              <button
                className="btn btn-error btn-sm"
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("token");
                    await api.delete('/user/delete', {
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    toast.success("Account deleted");
                    localStorage.removeItem("token");
                    navigate("/login");
                  } catch (err) {
                    toast.error(err?.response?.data?.message || "Account deletion failed");
                  } finally {
                    setShowDeleteModal(false);
                  }
                }}
              >
                Yes, Delete
              </button>
              <button
                className="btn btn-sm"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Settings;
