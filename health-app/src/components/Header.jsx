const Header = ({ t }) => {
  return (
    <div className="bg-blue-800 text-white py-8 px-6 text-center border-b border-blue-900 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-3">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-1 tracking-tight">{t.appTitle}</h1>
            <p className="text-blue-100 text-lg font-medium">{t.appSubtitle}</p>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-6 mt-4">
          <div className="flex items-center text-blue-100">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm font-medium">24/7 उपलब्ध</span>
          </div>
          <div className="flex items-center text-blue-100">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            <span className="text-sm font-medium">मुफ्त सेवा</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header