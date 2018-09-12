'use strict';
angular
    .module('app.core')
    .filter('encodeURIComponent', function() {
      return window.encodeURIComponent;
    })
    .controller('DetailsController', function($route, $scope, PageValues, $http, DatasetService) {
        //Set page title and description
        PageValues.title = "HOME";
        PageValues.description = "Learn AngularJS using best practice real world examples.";
        


         var vm = this;
        vm.datasetURI             = $route.current.params.collector_dataset;
        vm.download               = {};
        vm.api                    = {};
        vm.linkCustomAPI          = getUriCustomApi();
        vm.linkMetadadosApi       = getApiMetadados();
        vm.linkUri                = getUriDownload();
        vm.linkUriApiDocumentacao = getUriAPIDocumentacao();
        vm.datasetAtualizar       = {};
        vm.linkVersoes            = getApiVersoes();
        vm.linkVersaoEspecifica   = getApiVersaoEspecifica();
        vm.linkUriAtual           = getUriAtual();
        vm.linkUriAtualEncode     = getUriAtualEncode();
        vm.previewData            = [];
        vm.rowCollection          = [];   
        vm.lastVersion            = [];
        vm.lastVersionValue;
        vm.frequency;
        vm.fieldsCount;

        $scope.scrollTo = function(id) {
          var elmnt = document.getElementById(id);
          elmnt.scrollIntoView();
        }

        DatasetService.getPreservacao(vm.datasetURI).success(
          function(data) {     
            //console.log(data); 
              if (data==true) {
                 window.location = "410.html";
              } 
          }); 

        DatasetService.getAllFormats().success(
          function(data, status, headers, config) {      

              vm.download = angular.fromJson(data);

          }).error(function(data, status, headers, config) {      

              console.log("ERRO Formatos");
             //toastr.error("Erro ao carregar os Formatos de dados", 'Erro!'); //success,info,warning
        });   

        function getUriAtual() {
          return window.location.href;
        }

        function getUriAtualEncode() {
          return encodeURI(window.location.href);
        }

        function getUriCustomApi() {
          return apiUrl() + "open/execute_query";
        }

        function getUriDownload(){
          return apiUrl() + "open/" + vm.datasetURI + "/format/";
        }

        function getUriAPIDocumentacao(){
            return apiUrl() + "./documentacao/";
        }

        function getApiMetadados(){
          return apiUrl() + "open/about/" + vm.datasetURI + "/";
        }

        function getApiVersoes() {
          return apiUrl() + "open/" + vm.datasetURI + "/list_versions";
        }

        function getApiVersaoEspecifica() {
          return apiUrl() + "open/" + vm.datasetURI + "/version";
        }
        
        function getFrequency(f)
        { 	
        	switch(f)
        	{
        		case "POR_HORA":
        			vm.frequency = "Por Hora";
        			break;
        			
        		case "DIARIO":
        			vm.frequency = "Diário";
        			break;
        			
        		case "SEMANAL":
        			vm.frequency = "Semanal";
        			break;
        			
        		case "MENSAL":
        			vm.frequency = "Mensal";
        			break;
        			
        		case "SEMESTRAL":
        			vm.frequency = "Semestral";
        			break;	
        			
        		case "ANUAL":
        			vm.frequency = "Anual";
        			break;
        			
        		case "STATIC":
        			vm.frequency = "Estático";
        			break;
        	}
        }

        function getLastVersion() {
            DatasetService.getAllVersions(vm.datasetURI).success(
              function(data, status, headers, config) {
                vm.lastVersion = angular.fromJson(data); 
            });
        }

        DatasetService.getByIdDataset(vm.datasetURI).success(
          function(data, status, headers, config) {
             
              vm.rowCollectionDetails = data;
              vm.proxAtualizacao = vm.rowCollectionDetails.nextUpdate;
              vm.StructuralMetadata = vm.rowCollectionDetails.fieldDescriptions;
              //vm.frequency = (vm.rowCollectionDetails.frequency).replace("_", " ");
              vm.lastVersionValue = vm.rowCollectionDetails.lastVersion;
              getLastVersion();
              getFrequency(vm.rowCollectionDetails.frequency);
              vm.linkUriApi = getUriAPI(vm.lastVersionValue);

              
              //toastr.success("Dados carregados", 'Sucesso!');
              
              DatasetService.getPreviewData(vm.datasetURI, vm.lastVersionValue).success(
                      function(data, status, headers, config) {
                        vm.previewData = angular.fromJson(data); 
                        vm.fieldsCount = Object.keys(vm.previewData[0]).length;
                      }).error(function(data, status, headers, config) {         
                        console.log("ERRO Preview Data");
                    });

          }).error(function(data, status, headers, config) {      
            console.log("ERRO Conjunto de Dados");
             //toastr.error("Erro ao carregar os dados dos Conjuntos de Dados", 'Erro!'); //success,info,warning

        });    

   
               
        DatasetService.getAllVersions(vm.datasetURI).success(
          function(data, status, headers, config) {
              
              vm.rowCollection = angular.fromJson(data); 
             // toastr.success("Versões carregadas", 'Sucesso!');

          }).error(function(data, status, headers, config) {         
            console.log("ERRO Versões");
            //toastr.error("Erro ao carregar as versões do conjunto de dados", 'Erro!'); //success,info,warning
            
        });

        function getUriAPI(version){
            return apiUrl() + "open/preview/" + vm.datasetURI+ "/version/"+version+"/limit/100";
        }


    });
