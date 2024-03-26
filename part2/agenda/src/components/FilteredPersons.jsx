export const FilteredPersons = ({ persons, filterText }) => {
  const filteredPersons = persons.filter((person) => person.name.toLowerCase().includes(filterText.toLowerCase()))
  return (
    <div>
      <h3>Filtered persons</h3>
      {filteredPersons.map((person, index) => (
        <div key={index}>
          {person.name} - {person.number}
        </div>
      ))}
    </div>
  )
}

export default FilteredPersons
