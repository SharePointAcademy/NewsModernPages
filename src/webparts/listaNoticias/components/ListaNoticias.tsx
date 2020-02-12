import * as React from 'react';
import styles from './ListaNoticias.module.scss';
import { IListaNoticiasProps } from './IListaNoticiasProps';
import * as jquery from "jquery";

export interface IListaNoticiasState{
  items: [{
    Título: string,
    Nome: string,
    ID: number,
    URLDaImagemDaFaixa: string,
    Caminho: string,
    Descricao: string,
    StatusDeAprovacao: string,
    CriadoPor: {
      Nome: string
    }
  }]
}

export default class ListaNoticias extends React.Component<IListaNoticiasProps, IListaNoticiasState> {

  private listNews = "PáginasDoSite";

  public constructor(props: IListaNoticiasProps, state: IListaNoticiasState) {
    super(props);
    this.state = {
      items: [{
        Título: "",
        Nome: "",
        ID: 0,
        URLDaImagemDaFaixa: "",
        Caminho: "",
        Descricao: "",
        StatusDeAprovacao: "",
        CriadoPor: {
          Nome: ""
        }
      }]
    }
  }

  public componentDidMount() {
    let reactHandler = this;
    let query: string = "$select=Título,Nome,ID,URLDaImagemDaFaixa,Caminho,Descrição,StatusDeAprovação,CriadoPor/Nome&$expand=CriadoPor" +
                        "&$filter=Título ne null and URLDaImagemDaFaixa ne null and substringof('sitepagethumbnail', URLDaImagemDaFaixa) eq false";
    
    jquery.ajax({
      url: `${this.props.siteUrl}/_vti_bin/listdata.svc/${this.listNews}?${query}`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: (resultData) => {
        reactHandler.setState({          
          items: resultData.d.results
        });        
      },
      error: () => {
        console.log("Erro na API ");
      }
    });
  }

  public render(): React.ReactElement<IListaNoticiasProps> {
    return (
      <div className={ styles.listaNoticias }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <table>
      <thead>
          <tr>
              <th>Titulo</th>
              <th>Autor</th>
              <th>Imagem</th>
          </tr>
      </thead>
      <tbody>
          {            
            this.state.items.map( (item, key) => 
            <tr key={key}>
            <td>{item.Título}</td>
            <td>{item.CriadoPor.Nome}</td>       
            <td>
              <a href={`${item.Caminho}/${item.Nome}`} target="_blank">
              <img className={styles.imagem}
              src={`${item.URLDaImagemDaFaixa.toString().split(",")[0]}`} />              
              </a>
            </td>           
            </tr>            
          )}
      </tbody>
      </table>
          </div>
        </div>
      </div>
    );
  }
}
