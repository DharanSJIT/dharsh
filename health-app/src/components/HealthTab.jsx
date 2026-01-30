import { useState, useEffect } from 'react'

const HealthTab = ({ t }) => {
  const [medications, setMedications] = useState([])
  const [healthData, setHealthData] = useState([])
  const [medForm, setMedForm] = useState({ name: '', time: '', dosage: '' })
  const [healthForm, setHealthForm] = useState({ bp: '', sugar: '', weight: '' })

  useEffect(() => {
    const savedMeds = JSON.parse(localStorage.getItem('medications') || '[]')
    const savedHealth = JSON.parse(localStorage.getItem('healthData') || '[]')
    setMedications(savedMeds)
    setHealthData(savedHealth)
  }, [])

  const addMedication = () => {
    if (medForm.name && medForm.time && medForm.dosage) {
      const medication = {
        id: Date.now(),
        ...medForm,
        taken: false,
        date: new Date().toLocaleDateString()
      }
      
      const newMeds = [...medications, medication]
      setMedications(newMeds)
      localStorage.setItem('medications', JSON.stringify(newMeds))
      setMedForm({ name: '', time: '', dosage: '' })
      alert(`दवा जोड़ी गई: ${medForm.name} - ${medForm.time} पर ${medForm.dosage}`)
    }
  }

  const toggleMedication = (id) => {
    const updatedMeds = medications.map(med =>
      med.id === id ? { ...med, taken: !med.taken } : med
    )
    setMedications(updatedMeds)
    localStorage.setItem('medications', JSON.stringify(updatedMeds))
  }

  const saveHealthData = () => {
    if (healthForm.bp || healthForm.sugar || healthForm.weight) {
      const data = {
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        bp: healthForm.bp || 'N/A',
        sugar: healthForm.sugar || 'N/A',
        weight: healthForm.weight || 'N/A'
      }
      
      const newHealthData = [...healthData, data]
      setHealthData(newHealthData)
      localStorage.setItem('healthData', JSON.stringify(newHealthData))
      setHealthForm({ bp: '', sugar: '', weight: '' })
      alert('स्वास्थ्य डेटा सेव हो गया!')
    }
  }

  const todayMeds = medications.filter(med => med.date === new Date().toLocaleDateString())
  const recentHealthData = healthData.slice(-5).reverse()

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-gray-800">{t.healthTitle}</h2>

      <h3 className="text-lg font-semibold mb-4">{t.addMedicine}</h3>
      <div className="space-y-4 mb-6">
        <input
          type="text"
          value={medForm.name}
          onChange={(e) => setMedForm({...medForm, name: e.target.value})}
          placeholder={t.medicineName}
          className="w-full p-3 border border-gray-300 rounded-md text-base bg-white transition-colors focus:outline-none focus:border-blue-800 focus:shadow-sm focus:shadow-blue-800/10"
        />
        <input
          type="time"
          value={medForm.time}
          onChange={(e) => setMedForm({...medForm, time: e.target.value})}
          className="w-full p-3 border border-gray-300 rounded-md text-base bg-white transition-colors focus:outline-none focus:border-blue-800 focus:shadow-sm focus:shadow-blue-800/10"
        />
        <input
          type="text"
          value={medForm.dosage}
          onChange={(e) => setMedForm({...medForm, dosage: e.target.value})}
          placeholder={t.dosage}
          className="w-full p-3 border border-gray-300 rounded-md text-base bg-white transition-colors focus:outline-none focus:border-blue-800 focus:shadow-sm focus:shadow-blue-800/10"
        />
        <button
          onClick={addMedication}
          className="w-full p-3 bg-blue-800 text-white border-none rounded-md cursor-pointer text-base font-medium transition-colors hover:bg-blue-900"
        >
          {t.addMed}
        </button>
      </div>

      <h3 className="mt-5 text-lg font-semibold mb-4">{t.todayMedicines}</h3>
      {todayMeds.length === 0 ? (
        <p>{t.noMedicine}</p>
      ) : (
        <div className="space-y-3">
          {todayMeds.map((med) => (
            <div
              key={med.id}
              className={`flex justify-between items-center p-4 bg-white my-3 rounded-lg border-l-4 border border-gray-200 shadow-sm ${
                med.taken ? 'bg-green-50 border-l-green-600' : 'border-l-blue-800'
              }`}
            >
              <div>
                <strong>{med.name}</strong><br />
                <small>{med.time} - {med.dosage}</small>
              </div>
              <input
                type="checkbox"
                checked={med.taken}
                onChange={() => toggleMedication(med.id)}
                className="w-5 h-5 cursor-pointer accent-blue-800"
              />
            </div>
          ))}
        </div>
      )}

      <h3 className="mt-5 text-lg font-semibold mb-4">{t.healthData}</h3>
      <div className="space-y-4 mb-6">
        <input
          type="text"
          value={healthForm.bp}
          onChange={(e) => setHealthForm({...healthForm, bp: e.target.value})}
          placeholder={t.bloodPressure}
          className="w-full p-3 border border-gray-300 rounded-md text-base bg-white transition-colors focus:outline-none focus:border-blue-800 focus:shadow-sm focus:shadow-blue-800/10"
        />
        <input
          type="number"
          value={healthForm.sugar}
          onChange={(e) => setHealthForm({...healthForm, sugar: e.target.value})}
          placeholder={t.sugarLevel}
          className="w-full p-3 border border-gray-300 rounded-md text-base bg-white transition-colors focus:outline-none focus:border-blue-800 focus:shadow-sm focus:shadow-blue-800/10"
        />
        <input
          type="number"
          value={healthForm.weight}
          onChange={(e) => setHealthForm({...healthForm, weight: e.target.value})}
          placeholder={t.weight}
          className="w-full p-3 border border-gray-300 rounded-md text-base bg-white transition-colors focus:outline-none focus:border-blue-800 focus:shadow-sm focus:shadow-blue-800/10"
        />
        <button
          onClick={saveHealthData}
          className="w-full p-3 bg-blue-800 text-white border-none rounded-md cursor-pointer text-base font-medium transition-colors hover:bg-blue-900"
        >
          {t.saveData}
        </button>
      </div>

      {recentHealthData.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">{t.recentData}</h3>
          {recentHealthData.map((data, index) => (
            <div key={index} className="flex justify-between items-center p-4 bg-white my-3 rounded-lg border-l-4 border-sky-500 border border-gray-200 shadow-sm">
              <div>
                <strong>{data.date}</strong><br />
                <small>BP: {data.bp} | Sugar: {data.sugar} | Weight: {data.weight}kg</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HealthTab