import re

with open('src/components/home/FacultySection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace founder block
old_founder = '''\
        {founders.length > 0 && (
          <div className="mb-12 flex justify-center">
            {founders.map(f => (
              <div 
                key={f.id} 
                onClick={() => setSelectedFaculty(f)}
                className="cursor-pointer max-w-2xl w-full bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col md:flex-row items-center gap-8"
              >
                <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 bg-slate-200 rounded-full overflow-hidden border-4 border-white shadow-md">
                  {f.image_url ? (
                    <img src={f.image_url} alt={f.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100 font-bold text-4xl">
                      {f.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="text-center md:text-left flex-1">
                  <h4 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 tracking-tight">{f.name}</h4>
                  <div className="text-lg font-bold text-nipro-red">{f.role}</div>
                </div>
              </div>
            ))}
          </div>
        )}'''

new_founder = '''\
        {founders.length > 0 && (
          <div className="mb-12 flex flex-col items-center gap-8">
            {founders.map(f => (
              <div 
                key={f.id} 
                className="max-w-4xl w-full bg-slate-50 border border-slate-200 rounded-3xl p-8 transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col md:flex-row items-center md:items-start gap-8"
              >
                <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 bg-slate-200 rounded-full overflow-hidden border-4 border-white shadow-md">
                  {f.image_url ? (
                    <img src={f.image_url} alt={f.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100 font-bold text-4xl">
                      {f.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="text-center md:text-left flex-1">
                  <h4 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 tracking-tight">{f.name}</h4>
                  <div className="text-lg font-bold text-nipro-red mb-4">{f.role}</div>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{f.bio || ''}</p>
                </div>
              </div>
            ))}
          </div>
        )}'''

content = content.replace(old_founder, new_founder)

with open('src/components/home/FacultySection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
