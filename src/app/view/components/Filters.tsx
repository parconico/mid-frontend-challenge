import { usePropertyContext } from "@/app/context/PropertyContext";
import { useEffect } from "react";
import CreatePropertyModal from "./CreatePropertyModal";
import Add from "./Icons/Add";
import Search from "./Icons/Search";

export default function Filters() {
  const {
    properties,
    searchTerm,
    setSearchTerm,
    propertyType,
    setPropertyType,
    propertyStatus,
    setPropertyStatus,
    sortOrder,
    setSortOrder,
    setFilteredProperties,
    currentPage,
    isModalOpen,
    setIsModalOpen,
    setCurrentPage,
    setTotalPages,
  } = usePropertyContext();

  const propertiesPerPage = 20;

  useEffect(() => {
    const result = properties
      .filter((property) => {
        const matchesSearch =
          (searchTerm &&
            (property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              property.address
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()))) ||
          !searchTerm; // Si el searchTerm está vacío, no se filtra por título o dirección
        const matchesType =
          !propertyType ||
          property.type.toLowerCase() === propertyType.toLowerCase();

        const matchesStatus =
          !propertyStatus ||
          property.status.toLowerCase() === propertyStatus.toLowerCase();
        return matchesSearch && matchesType && matchesStatus;
      })
      .sort((a, b) => {
        return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
      });
    // Recalcular el total de páginas basado en las propiedades filtradas
    const totalFilteredPages = Math.ceil(result.length / propertiesPerPage);

    // Ajustar la página actual si es mayor al total recalculado
    if (currentPage > totalFilteredPages) {
      setCurrentPage(1); // Reiniciar a la primera página si es necesario
    }

    const startIndex = (currentPage - 1) * propertiesPerPage;
    const endIndex = startIndex + propertiesPerPage;

    // Actualizar las propiedades filtradas para la página actual
    setFilteredProperties(result.slice(startIndex, endIndex));

    // Actualizar el total de páginas
    setTotalPages(totalFilteredPages);
  }, [
    searchTerm,
    properties,
    setFilteredProperties,
    propertyType,
    propertyStatus,
    sortOrder,
    currentPage,
    setCurrentPage,
    setTotalPages,
  ]);
  return (
    <>
      <div className="px-4 mb-2">
        <div className="relative w-full mb-2">
          <Search className="size-6 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por título o dirección..."
            className="w-full pl-10 h-10 text-sm border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4 mb-2">
          <select
            className="w-1/2 h-8 text-sm font-medium border rounded-md"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option value="">Tipo de propiedad</option>
            <option value="house">Casa</option>
            <option value="apartment">Departamento</option>
            <option value="land">Terreno</option>
            <option value="office">Oficina</option>
          </select>
          <select
            className="w-1/2 h-8 text-sm font-medium border rounded-md"
            value={propertyStatus}
            onChange={(e) => setPropertyStatus(e.target.value)}
          >
            <option value="">Estado</option>
            <option value="rent">Alquiler</option>
            <option value="sale">Venta</option>
          </select>
        </div>
        <div className="flex flex-row items-center gap-2 justify-between">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-sm py-2 px-2 rounded-md text-white font-medium flex flex-row gap-1"
          >
            <Add />
            Nueva propiedad
          </button>
          <div className="flex flex-row gap-2">
            <label className="text-gray-700 font-semibold">
              Ordenar por precio:
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm">Mayor precio</span>
              <label>
                <input
                  type="checkbox"
                  checked={sortOrder === "desc"}
                  onChange={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className=""
                />
              </label>
              <span className="text-sm">Menor precio</span>
              <label>
                <input
                  type="checkbox"
                  checked={sortOrder === "asc"}
                  onChange={() =>
                    setSortOrder(sortOrder === "desc" ? "asc" : "desc")
                  }
                  className=""
                />
              </label>
            </div>
          </div>
        </div>
      </div>
      <CreatePropertyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
