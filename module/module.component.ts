{  
itemsRef
  public medidores

  async getWithPromise(){
    this.medidores = await this.medicaoService.getMedidores().pipe(first()).toPromise().then(res => {
      this.medidores = res.map(e => {
        //console.log(e.payload.val())
        return e.key
      });
      return  this.medidores 
    });
    console.log('fora', this.medidores)
    //utilizando snapshotChanges para retornar metadados
  }

  getWithSubscribe(){
    this.medidores = this.medicaoService.getMedidores().pipe(takeUntil(this.end)).subscribe(async res => {
      this.medidores = res.map(e => {
        return {'id': e.key, 'values': e.payload.val()}
      });
      console.log( 'medidores', this.medidores);
      return this.medidores 

    });
    console.log('fora', this.medidores)
    //utilizando snapshotChanges para retornar metadados
  }
  getRealTimeDb2(){
     this.itemsRef = this.db.list('medidores');
    var medidores = []
    this.itemsRef.snapshotChanges()
      .subscribe(actions => {
        actions.forEach(action => {
          //console.log('type', action.type);
          medidores.push(action.key)
          console.log('key', action.key);
          //console.log('payload',action.payload.val());
        });
      });
    console.log(medidores)
  }

  getMedidores(){
    const ref3 = this.db.list('medidores', ref =>   ref.limitToLast(25) ).valueChanges()
    ref3.subscribe(items => {
      console.log(items)
      var medidores = []
      items.forEach(item => { 
        console.log(item)
        //medidores.push(item['umidade'])
      })
    }
  );
  

  }


  async inicializando(){
    //valuechange para retornar somente dados
    const ref = this.db.object('medidores/0000000016223e72/medicao').valueChanges();
    const ref2 = this.db.list('medidores/0000000016223e72/medicoes', ref =>   ref.limitToLast(25) ).valueChanges()


    ref2.subscribe(items => {
        var umidades = []
        var temps = []
        var datas = []
        this.temperaturas = []
        console.log('antes', this.lineChartData)
        items.forEach(item => { 
          var dadosGrafico = [['Data', 'Umidade', 'Temperatura']]
          //dadosGrafico.push([new Date(item['updated']).getHours() + ":"+ new Date(item['updated']).getMinutes(),item['umidade'], item['temperatura']])
          //this.lineChartLabels.push(new Date(item['updated']).getDay()+ " - " + new Date(item['updated']).getHours() + ":"+ new Date(item['updated']).getMinutes())
          this.lineChartLabels.push(item['updated'])
          umidades.push(item['umidade'])
          var t = (item['temperatura'] - 32) / 1.8
          temps.push(parseFloat(t.toFixed(1)))
          this.temperaturas.push(parseFloat(t.toFixed(1)))
          //console.log('dddd', parseFloat(t.toFixed(1)), item['temperatura'])
          //this.lineChartData.push({data: item['temperatura'], label:"Temperatura"}, {data: item['umidade'], label:"Umidade"})
          //datas.push(new Date(item['updated']).getDay()+ " - " + new Date(item['updated']).getHours() + ":"+ new Date(item['updated']).getMinutes())
        })
        console.log('teste22', this.lineChartData, temps, umidades)
        this.lineChartData.push({data: temps, label:"Temperatura"}, {data: umidades, label:"Umidade"})
        console.log('teste222', this.lineChartData)
        //this.lineChartMethod(temperaturas, umidades, datas)
      }
    );
    
    //;

    ref.subscribe(med => {
      if(med){}
        this.medicao = med
        try {
          var spl = med['updated'].split(' ')
          var spl1 = spl[0].split('-')
          var spl2 = spl[1].split(':')
          this.medicao.updated = `${spl1[2]}/${spl1[1]} - ${spl2[0]}:${spl2[1]}`
        } catch (error) {
          this.medicao.updated = 'erro'
        }
        let temp1 = (med['temperatura'] - 32) / 1.8
        this.medicao.temperatura = parseFloat(temp1.toFixed(1))
      }
      )
  }
  ngOnDestroy(): void {
    this.end.next();
    this.end.complete();
  }
}
