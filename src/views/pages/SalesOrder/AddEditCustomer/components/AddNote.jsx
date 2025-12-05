import InputGroup from '@/components/ui/InputGroup'
import Input from '@/components/ui/Input'
import { PiNotePencil } from "react-icons/pi";

const { Addon } = InputGroup

const AddNote = ({ formData, handleInputChange }) => {
    return (
        <div className="flex-2">
            {['notes1', 'notes2', 'notes3', 'notes4', 'notes5', 'notes6'].map((note, index) => (
                <div key={note} className="mb-4">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Notes {index + 1}
                    </label>
                    <InputGroup>
                        <Addon><PiNotePencil /></Addon>
                        <Input
                            name={note}
                            value={formData[note]}
                            className="bg-white"
                            onChange={handleInputChange}
                        />
                    </InputGroup>
                </div>
            ))}
        </div>
    )
}

export default AddNote
