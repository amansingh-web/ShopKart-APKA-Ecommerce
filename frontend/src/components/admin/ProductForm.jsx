import { useState } from 'react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { FiUpload, FiX, FiPlus } from 'react-icons/fi'

const CATS = ['Electronics','Fashion','Home & Kitchen','Books','Sports & Fitness','Beauty','Toys','Automotive','Grocery']
const SUBS = { Electronics:['Smartphones','Laptops','Audio','TVs','Cameras','Accessories'], Fashion:['Men Clothing','Women Clothing','Footwear','Bags','Watches'], 'Home & Kitchen':['Cookware','Appliances','Furniture','Bedding','Cleaning'], Books:['Fiction','Non-Fiction','Self Help','Technology','Education'], 'Sports & Fitness':['Yoga','Weights','Cardio','Outdoor','Cycling'], Beauty:['Skincare','Haircare','Makeup','Fragrance','Personal Care'], Toys:['Action','Board Games','Educational','Outdoor'], Automotive:['Car Accessories','Bikes','Tools'], Grocery:['Beverages','Snacks','Dairy','Bakery'] }

function toSpecArr(s) {
  if (!s) return [{ k:'', v:'' }]
  const entries = s instanceof Map ? [...s.entries()] : typeof s==='object' ? Object.entries(s) : []
  return entries.length ? entries.map(([k,v])=>({k,v})) : [{k:'',v:''}]
}

export default function ProductForm({ initial, onSubmit, loading }) {
  const empty = { k:'', v:'' }
  const [form, setForm] = useState({
    name:          initial?.name          || '',
    shortDesc:     initial?.shortDesc     || '',
    description:   initial?.description   || '',
    price:         initial?.price         || '',
    originalPrice: initial?.originalPrice || '',
    category:      initial?.category      || '',
    subCategory:   initial?.subCategory   || '',
    brand:         initial?.brand         || '',
    stock:         initial?.stock !== undefined ? initial.stock : '',
    isFeatured:    initial?.isFeatured    || false,
    images:        initial?.images        || [],
    tags:          initial?.tags?.join(', ')   || '',
    specs:         toSpecArr(initial?.specifications),
  })
  const [uploading, setUploading] = useState(false)
  const [errors,    setErrors]    = useState({})

  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  const validate = () => {
    const e = {}
    if (!form.name.trim())        e.name        = 'Product name required'
    if (!form.description.trim()) e.description = 'Description required'
    if (!form.price||form.price<=0) e.price     = 'Valid price required'
    if (!form.category)           e.category    = 'Category required'
    if (form.stock===''||form.stock<0) e.stock  = 'Valid stock required'
    setErrors(e); return !Object.keys(e).length
  }

  const uploadImages = async e => {
    const files = [...e.target.files]; if (!files.length) return
    if (form.images.length+files.length>5) { toast.error('Max 5 images'); return }
    setUploading(true)
    try {
      const fd = new FormData(); files.forEach(f=>fd.append('images',f))
      const {data} = await api.post('/upload/multiple', fd, {headers:{'Content-Type':'multipart/form-data'}})
      set('images',[...form.images,...data.images]); toast.success('Images uploaded!')
    } catch { toast.error('Upload failed') } finally { setUploading(false) }
  }

  const submit = e => {
    e.preventDefault(); if (!validate()) return
    const specObj = {}
    form.specs.filter(s=>s.k.trim()).forEach(s=>{ specObj[s.k.trim()]=s.v.trim() })
    onSubmit({ name:form.name.trim(), shortDesc:form.shortDesc.trim(), description:form.description.trim(), price:Number(form.price), originalPrice:Number(form.originalPrice)||Number(form.price), category:form.category, subCategory:form.subCategory, brand:form.brand.trim(), stock:Number(form.stock), isFeatured:form.isFeatured, images:form.images, tags:form.tags.split(',').map(t=>t.trim()).filter(Boolean), specifications:specObj })
  }

  const subs = SUBS[form.category] || []

  return (
    <form onSubmit={submit} className="pf-form">
      <div className="pf-layout">
        {/* Left */}
        <div className="pf-left">
          <div className="pf-section">
            <h3>Basic Information</h3>
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input className={`form-input ${errors.name?'error':''}`} value={form.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Apple iPhone 15 Pro Max"/>
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Short Description</label>
              <input className="form-input" value={form.shortDesc} onChange={e=>set('shortDesc',e.target.value)} placeholder="One-line product highlight"/>
            </div>
            <div className="form-group">
              <label className="form-label">Full Description *</label>
              <textarea className={`form-input ${errors.description?'error':''}`} rows={5} value={form.description} onChange={e=>set('description',e.target.value)} placeholder="Detailed product description..."/>
              {errors.description && <span className="form-error">{errors.description}</span>}
            </div>
          </div>

          <div className="pf-section">
            <h3>Pricing & Inventory</h3>
            <div className="pf-2col">
              <div className="form-group">
                <label className="form-label">Selling Price (₹) *</label>
                <input type="number" className={`form-input ${errors.price?'error':''}`} value={form.price} onChange={e=>set('price',e.target.value)} placeholder="0" min="0"/>
                {errors.price && <span className="form-error">{errors.price}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Original MRP (₹)</label>
                <input type="number" className="form-input" value={form.originalPrice} onChange={e=>set('originalPrice',e.target.value)} placeholder="0" min="0"/>
              </div>
              <div className="form-group">
                <label className="form-label">Stock Quantity *</label>
                <input type="number" className={`form-input ${errors.stock?'error':''}`} value={form.stock} onChange={e=>set('stock',e.target.value)} placeholder="0" min="0"/>
                {errors.stock && <span className="form-error">{errors.stock}</span>}
              </div>
              <div className="form-group" style={{display:'flex',alignItems:'center',paddingTop:28}}>
                <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:'.9rem',fontWeight:500}}>
                  <input type="checkbox" style={{width:'auto',accentColor:'var(--primary)'}} checked={form.isFeatured} onChange={e=>set('isFeatured',e.target.checked)}/>
                  Mark as Featured
                </label>
              </div>
            </div>
          </div>

          <div className="pf-section">
            <h3>Specifications</h3>
            {form.specs.map((s,i)=>(
              <div key={i} style={{display:'flex',gap:6,marginBottom:7}}>
                <input className="form-input" style={{flex:1}} placeholder="Key (e.g. RAM)" value={s.k} onChange={e=>{const sp=[...form.specs];sp[i]={...sp[i],k:e.target.value};set('specs',sp)}}/>
                <input className="form-input" style={{flex:2}} placeholder="Value (e.g. 16GB)" value={s.v} onChange={e=>{const sp=[...form.specs];sp[i]={...sp[i],v:e.target.value};set('specs',sp)}}/>
                <button type="button" className="spec-del" onClick={()=>set('specs',form.specs.filter((_,j)=>j!==i))}><FiX size={12}/></button>
              </div>
            ))}
            <button type="button" className="btn btn-ghost btn-sm" onClick={()=>set('specs',[...form.specs,empty])}>
              <FiPlus size={13}/> Add Spec
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="pf-right">
          <div className="pf-section">
            <h3>Category & Brand</h3>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className={`form-input ${errors.category?'error':''}`} value={form.category} onChange={e=>{set('category',e.target.value);set('subCategory','')}}>
                <option value="">Select Category</option>
                {CATS.map(c=><option key={c}>{c}</option>)}
              </select>
              {errors.category && <span className="form-error">{errors.category}</span>}
            </div>
            {subs.length>0 && (
              <div className="form-group">
                <label className="form-label">Sub Category</label>
                <select className="form-input" value={form.subCategory} onChange={e=>set('subCategory',e.target.value)}>
                  <option value="">Select Sub Category</option>
                  {subs.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Brand</label>
              <input className="form-input" value={form.brand} onChange={e=>set('brand',e.target.value)} placeholder="e.g. Apple, Samsung, Nike"/>
            </div>
            <div className="form-group">
              <label className="form-label">Tags (comma-separated)</label>
              <input className="form-input" value={form.tags} onChange={e=>set('tags',e.target.value)} placeholder="apple, iphone, 5g"/>
            </div>
          </div>

          <div className="pf-section">
            <h3>Product Images (Max 5)</h3>
            <label className="pf-upload-area">
              <FiUpload size={22}/>
              <span>{uploading?'Uploading...':'Click to upload images'}</span>
              <small>PNG, JPG, WEBP up to 5MB each</small>
              <input type="file" accept="image/*" multiple hidden onChange={uploadImages} disabled={uploading||form.images.length>=5}/>
            </label>
            {form.images.length>0 && (
              <div className="pf-img-grid">
                {form.images.map((img,i)=>(
                  <div key={i} className="pf-img">
                    <img src={img.url} alt="" onError={e=>e.target.src='https://via.placeholder.com/80'}/>
                    <button type="button" className="pf-img-del" onClick={()=>set('images',form.images.filter((_,j)=>j!==i))}><FiX size={9}/></button>
                    {i===0 && <span className="pf-img-main">Main</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pf-footer">
        <button type="submit" className="btn btn-primary btn-lg" disabled={loading||uploading}>
          {loading?'Saving...':'💾 Save Product'}
        </button>
      </div>

      <style>{`
        .pf-form { background:#fff;border-radius:12px;padding:20px;box-shadow:var(--shadow-sm); }
        .pf-layout { display:grid;grid-template-columns:1fr 360px;gap:24px; }
        .pf-section { margin-bottom:24px;padding-bottom:20px;border-bottom:1px solid var(--gray-200);display:flex;flex-direction:column;gap:12px; }
        .pf-section:last-child { border-bottom:none;margin-bottom:0; }
        .pf-section h3 { font-size:.82rem;font-weight:700;text-transform:uppercase;color:var(--gray-400);letter-spacing:.5px; }
        .pf-2col { display:grid;grid-template-columns:1fr 1fr;gap:12px; }
        .spec-del { width:30px;height:38px;background:#ffebee;color:var(--accent);border:none;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .pf-upload-area { display:flex;flex-direction:column;align-items:center;gap:6px;border:2px dashed var(--gray-200);border-radius:10px;padding:20px;cursor:pointer;text-align:center;transition:.15s;font-size:.875rem;color:var(--gray-600); }
        .pf-upload-area:hover { border-color:var(--primary);background:var(--primary-light); }
        .pf-upload-area small { font-size:.72rem;color:var(--gray-400); }
        .pf-img-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-top:8px; }
        .pf-img { position:relative;aspect-ratio:1;border-radius:7px;overflow:hidden;border:1.5px solid var(--gray-200); }
        .pf-img img { width:100%;height:100%;object-fit:contain;padding:3px; }
        .pf-img-del { position:absolute;top:3px;right:3px;background:var(--accent);color:#fff;border:none;border-radius:50%;width:16px;height:16px;cursor:pointer;display:flex;align-items:center;justify-content:center; }
        .pf-img-main { position:absolute;bottom:3px;left:3px;background:var(--primary);color:#fff;font-size:.58rem;font-weight:700;padding:1px 4px;border-radius:3px; }
        .pf-footer { margin-top:20px;padding-top:16px;border-top:1px solid var(--gray-200); }
        @media(max-width:1000px) { .pf-layout{grid-template-columns:1fr;} }
        @media(max-width:600px) { .pf-2col{grid-template-columns:1fr;} .pf-img-grid{grid-template-columns:repeat(3,1fr);} }
      `}</style>
    </form>
  )
}
