useEffect(() => {
    if (!mounted || activeTab !== 'Análisis Técnico') return;
    
    async function fetchTechData() {
      setLoading(true);
      setErrorMsg(null);
      try {
        // CORRECCIÓN CLAVE AQUÍ PARA ENLAZAR AL BACKEND
        const cleanSymbol = tokenTech.replace('/', '');
        const res = await fetch(`/api/report?symbol=${cleanSymbol}`);
        const json = await res.json();
        
        // CORRECCIÓN CLAVE: El backend devuelve 'data' como Array
        if (json.data && json.data.length > 0) {
          setTechData(json.data[0]);
        } else {
          setErrorMsg(json.error || `Error buscando: ${tokenTech}`);
        }
      } catch (e) {
        setErrorMsg("Error crítico de conexión al Backend.");
      } finally {
        setLoading(false);
      }
    }
    fetchTechData();
  }, [tokenTech, activeTab, mounted]);
