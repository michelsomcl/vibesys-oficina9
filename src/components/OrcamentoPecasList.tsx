
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import { usePecas } from "@/hooks/usePecas"
import { useOrcamentoPecas, useCreateOrcamentoPeca, useDeleteOrcamentoPeca } from "@/hooks/useOrcamentoPecas"

interface OrcamentoPecasListProps {
  orcamentoId?: string
}

export const OrcamentoPecasList = ({ orcamentoId }: OrcamentoPecasListProps) => {
  const [selectedPecaId, setSelectedPecaId] = useState("")
  const [quantidade, setQuantidade] = useState("")
  const [valorUnitario, setValorUnitario] = useState("")

  const { data: pecas = [] } = usePecas()
  const { data: orcamentoPecas = [] } = useOrcamentoPecas(orcamentoId)
  const createOrcamentoPeca = useCreateOrcamentoPeca()
  const deleteOrcamentoPeca = useDeleteOrcamentoPeca()

  const handleAddPeca = () => {
    if (!orcamentoId || !selectedPecaId || !quantidade || !valorUnitario) {
      return
    }

    createOrcamentoPeca.mutate({
      orcamento_id: orcamentoId,
      peca_id: selectedPecaId,
      quantidade: parseInt(quantidade),
      valor_unitario: parseFloat(valorUnitario),
    })

    // Limpar campos
    setSelectedPecaId("")
    setQuantidade("")
    setValorUnitario("")
  }

  const handleRemovePeca = (id: string) => {
    if (!orcamentoId) return
    deleteOrcamentoPeca.mutate({ id, orcamentoId })
  }

  const handlePecaChange = (pecaId: string) => {
    setSelectedPecaId(pecaId)
    const peca = pecas.find(p => p.id === pecaId)
    if (peca) {
      setValorUnitario(peca.valor_unitario.toString())
    }
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Peças</h3>
      
      {/* Lista de peças existentes */}
      <div className="space-y-2 mb-4">
        {orcamentoPecas.map((item) => (
          <div key={item.id} className="grid grid-cols-5 gap-2 items-center p-2 border rounded">
            <span className="text-sm">{item.peca?.nome}</span>
            <span className="text-sm text-center">{item.quantidade}</span>
            <span className="text-sm text-center">R$ {item.valor_unitario.toString()}</span>
            <span className="text-sm text-center font-medium">
              R$ {(item.quantidade * parseFloat(item.valor_unitario.toString())).toFixed(2)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRemovePeca(item.id)}
              className="w-8 h-8 p-0"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Formulário para adicionar nova peça */}
      <div className="grid grid-cols-5 gap-2 items-end">
        <div>
          <label className="text-sm font-medium">Peça</label>
          <Select value={selectedPecaId} onValueChange={handlePecaChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {pecas.map((peca) => (
                <SelectItem key={peca.id} value={peca.id}>
                  {peca.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Qtd</label>
          <Input
            type="number"
            placeholder="Qtd"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Valor Unit.</label>
          <Input
            type="number"
            step="0.01"
            placeholder="0,00"
            value={valorUnitario}
            onChange={(e) => setValorUnitario(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Total</label>
          <Input
            value={quantidade && valorUnitario ? 
              `R$ ${(parseFloat(quantidade) * parseFloat(valorUnitario)).toFixed(2)}` : 
              "R$ 0,00"
            }
            readOnly
            className="bg-gray-50"
          />
        </div>
        <Button
          variant="outline"
          onClick={handleAddPeca}
          disabled={!selectedPecaId || !quantidade || !valorUnitario || createOrcamentoPeca.isPending}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
