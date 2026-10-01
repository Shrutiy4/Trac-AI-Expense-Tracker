import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UploadCloud, ImagePlus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/axios'

const UploadBill = () => {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    const uploaded = acceptedFiles[0];
    if (uploaded) {
      setFile(uploaded);
      setPreview(URL.createObjectURL(uploaded));
      toast.success('Bill uploaded successfully!');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const handleFileInput = (e) => {
    const uploaded = e.target.files[0];
    if (uploaded) {
      setFile(uploaded);
      setPreview(URL.createObjectURL(uploaded));
      toast.success('Bill uploaded successfully!');
    }
  };

  const handleMindeeResponse = (json) => {
    try {
      const prediction = json?.document?.inference?.prediction;
      console.log("Mindee Prediction:", prediction);

      const items = prediction.line_items || [];
        const topItem = items.length > 0 ? items[0].description : null;

        const title =
        topItem?.length > 2
            ? topItem
            : prediction.supplier_name?.value ||
            prediction.document_type?.value ||
            'Untitled';

      const amount = prediction.total_amount?.value || '';
      const date = prediction.date?.value || '';
      const currency = prediction.locale?.currency || '';
      const category = prediction.category?.value || '';
      const merchant = prediction.supplier_name?.value || '';

      const knownCategories = [
        'bills',
        'entertainment',
        'food',
        'groceries',
        'medical',
        'shopping',
        'subscriptions',
        'transport',
        'utilities',
      ];
      const isCustomCategory = category && !knownCategories.includes(category);

      const extractedData = {
        title,
        amount,
        date,
        currency,
        category: isCustomCategory ? 'Custom' : category || '',
        customCategory: isCustomCategory ? category : '',
        merchant
      };

      localStorage.setItem('ocrData', JSON.stringify(extractedData));
      toast.success('Fields extracted from bill!');
      navigate('/add-expense');
    } catch (err) {
      console.error("Error parsing Mindee response:", err);
      toast.error("Could not extract fields from receipt.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true); // Start processing

    const formData = new FormData();
    formData.append("document", file);

    try {
      const res = await api.post('/ocr/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });



      const data = res.data;
      console.log("Mindee OCR:", data);
      handleMindeeResponse(data);
    } catch (error) {
      console.error("Mindee API error:", error);
      toast.error("Receipt analysis failed");
    } finally{
        setIsProcessing(false); // Stop processing
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <button
        onClick={() => navigate(-1)}
        className="btn btn-sm btn-ghost mb-4 flex items-center gap-2"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <h2 className="text-2xl font-bold mb-2 text-primary">Upload Bill</h2>
      <p className="text-base-content/80 mb-4">Choose how you want to upload your bill image</p>

      <div className="flex flex-col gap-4">
        {isDesktop && (
          <>
            <div
              {...getRootProps()}
              className={`border-dashed border-2 rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragActive ? 'bg-base-300 border-info' : 'bg-base-200 border-base-content/30'
              }`}
            >
              <input {...getInputProps()} />
              <UploadCloud className="mx-auto mb-2 text-info" size={40} />
              {isDragActive ? (
                <p>Drop the image here ...</p>
              ) : (
                <p>Drag & drop a bill image, or click to select</p>
              )}
            </div>
            <div className="divider text-xs">OR</div>
          </>
        )}

        <div>
          <label className="text-sm font-medium mb-2 block">Upload via file picker</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="file-input file-input-bordered w-full 
                      [&::file-selector-button]:bg-primary 
                      [&::file-selector-button]:text-white 
                      [&::file-selector-button]:hover:bg-primary/90"
          />
        </div>

        {!isDesktop && (
          <div className="mt-4">
            <label htmlFor="cameraInput" className="btn btn-outline btn-accent w-full flex items-center gap-2">
              <ImagePlus size={18} />
              Capture via Camera
            </label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              id="cameraInput"
              className="hidden"
              onChange={(e) => {
                const uploaded = e.target.files[0];
                if (uploaded) {
                  setFile(uploaded);
                  setPreview(URL.createObjectURL(uploaded));
                  toast.success("Bill captured from camera!");
                }
              }}
            />
          </div>
        )}

      </div>

      {preview && (
        <div className="mt-6 bg-base-100 rounded border p-2">
          <img
            src={preview}
            alt="Preview"
            className="w-full max-h-64 object-contain rounded"
          />
        </div>
      )}

      <button
        className="btn btn-primary w-full mt-6"
        onClick={handleSubmit}
        disabled={!file || isProcessing}
        >
        {isProcessing ? (
            <>
            <span className="loading loading-spinner loading-sm mr-2" />
            Processing...
            </>
        ) : (
            'Process Bill'
        )}
        </button>

    </div>
  );
};

export default UploadBill;
