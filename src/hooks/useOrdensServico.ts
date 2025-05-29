
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types"
import { toast } from "sonner"

type OrdemServico = Tables<"ordem_servico">
type OrdemServicoInsert = TablesInsert<"ordem_servico">
type OrdemServicoUpdate = TablesUpdate<"ordem_servico">

export interface OrdemServicoWithDetails extends OrdemServico {
  cliente?: Tables<"clientes">
  veiculo?: Tables<"veiculos">
  orcamento?: Tables<"orcamentos"> & {
    orcamento_pecas?: (Tables<"orcamento_pecas"> & {
      peca: Tables<"pecas">
    })[]
    orcamento_servicos?: (Tables<"orcamento_servicos"> & {
      servico: Tables<"servicos">
    })[]
  }
}

export const useOrdensServico = () => {
  return useQuery({
    queryKey: ["ordens_servico"],
    queryFn: async (): Promise<OrdemServicoWithDetails[]> => {
      const { data: ordensServico, error } = await supabase
        .from("ordem_servico")
        .select(`
          *,
          cliente:clientes(*),
          veiculo:veiculos(*),
          orcamento:orcamentos(
            *,
            orcamento_pecas(
              *,
              peca:pecas(*)
            ),
            orcamento_servicos(
              *,
              servico:servicos(*)
            )
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      return ordensServico || []
    },
  })
}

export const useUpdateOrdemServico = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: OrdemServicoUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("ordem_servico")
        .update(updates)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordens_servico"] })
      toast.success("Ordem de serviço atualizada com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao atualizar ordem de serviço:", error)
      toast.error("Erro ao atualizar ordem de serviço")
    },
  })
}

export const useCreateOrdemServico = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ordemServico: OrdemServicoInsert) => {
      const { data: newOS, error } = await supabase
        .from("ordem_servico")
        .insert(ordemServico)
        .select()
        .single()

      if (error) throw error
      return newOS
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordens_servico"] })
      toast.success("Ordem de serviço criada com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao criar ordem de serviço:", error)
      toast.error("Erro ao criar ordem de serviço")
    },
  })
}
