/**************************************
* jQuery.spinTheWheel 0.9.0
* Ronnie Persson, Binofo 2008
* Creates a spinning wheel out of an element
***************************************/


jQuery.fn.spinTheWheel = function( options ) {
			
			var defaults = { 
				minValue: 0, 
				maxValue: 100, 
				defaultValue: 50, 
				valueSpan: 10, 
				callback: null, 
				horizontal: true,
				nrElements: 7,
				cursor: "ew-resize",
				snap: false,
				valueTransform: function( value ){ return value },
				transformValue: function( value ){ return value },
				valueTranslate: function( value ){ return value },
				translateValue: function( value ){ return value },
				overlay:null
			};

			var options = jQuery.extend( defaults, options );
			
    		return this.each( function(){
        		this.spinner = new jQuery.spinner( this, options );
			
				jQuery(this).data("spinner",this.spinner);
				
				jQuery(this).mousedown( function( event ) {
					
					var spinner = jQuery(this).data("spinner");
					spinner.mouseButtonIsDown = true;
					
					event.stopPropagation();
					event.preventDefault();
										
					if (spinner.horizontal)
						spinner.startSpinX = event.pageX;
					else
						spinner.startSpinX = event.pageY;
						
					spinner.startSpinV = spinner.value;	
					
					jQuery(this).parents().bind("mousemove.spinTheWheel", function ( event ) {
					
						if ( spinner.mouseButtonIsDown )
						{
							event.stopPropagation();
							
							if (spinner.horizontal)
								x = event.pageX;
							else
								x = event.pageY;
								
							spinner.spinTheWheel( x );
						}
					});
					
					if (options.overlay)
					{
						jQuery(options.overlay).bind("mousemove.spinTheWheel", function ( event ) {

							if ( spinner.mouseButtonIsDown )
							{
								//alert("hej");
								event.stopPropagation();

								if (spinner.horizontal)
									x = event.pageX;
								else
									x = event.pageY;

								spinner.spinTheWheel( x );
							}
						});
					}
					
					jQuery(this).parents().bind("mouseup.spinTheWheel", function( event ) {
						if (spinner.mouseButtonIsDown)
						{
							spinner.obj.parents().unbind("mouseup.spinTheWheel");
							spinner.mouseButtonIsDown = false;
							event.stopPropagation();
							
							if( Math.abs( spinner.speed ) > spinner.valueSpan * 2 )  //is the mouse movement big enough to be intrepreted to be a spin
							{
								if ( spinner.intervalId > -1 )
								{
									clearInterval( spinner.intervalId );
								}

								spinner.intervalId = setInterval( function()
								{
									spinner.speed /= 1.1;
									spinner.setValue( spinner.value - spinner.speed / spinner.resFactor );
									if ( spinner.speed  < 0.5 )
									{
										clearInterval( spinner.intervalId );
									}
									}, 10 );
								}
							}
						});
					});



				jQuery(this).mousemove( function ( event ){
					var spinner = jQuery(this).data("spinner");
					
					if ( spinner.mouseButtonIsDown )
					{
						event.stopPropagation();
						
						if ( spinner.horizontal )
							x = event.pageX;
						else
							x = event.pageY;
							
						spinner.spinTheWheel( x );
					}
				});
				
				
    		});
		};

	jQuery.spinner = function( o, options ) { 
				this.obj = jQuery(o);
				
				this.options= options;
				
				this.initialize = function()
				{
					if ( this.options.list )
					{
						this.list = this.options.list;
						this.minValue = 0;
						this.maxValue = this.list.length - 1; 
						this.defaultValue = this.options.defaultValue; 	//start value
						this.valueSpan = 1;	//distance between displayed values, if 10 then the values displayed would be 10,20,30,40
						this.callback = this.options.callback; 			//when changed this function will be called
						this.horizontal = false || this.options.horizontal; 		//not implemented yet
						this.nrElements = this.options.nrElements; 		//nr of elements to display the values, must be an even number
						this.cursor = this.options.cursor;
						this.snap = true || this.options.snap;
						this.valueTransform = this.options.valueTransform;
						this.transformValue = this.options.transformValue;
						this.valueTranslate = (function( index )
						{
							return this.list[index];
						});
						this.translateValue = this.options.translateValue;
						}else
						{
							this.minValue = this.options.minValue;
							this.maxValue = this.options.maxValue; 
							this.defaultValue = this.options.defaultValue; 	//start value
							this.valueSpan = this.options.valueSpan;			//distance between displayed values, if 10 then the values displayed would be 10,20,30,40
							this.callback = this.options.callback; 			//when changed this function will be called
							this.horizontal = this.options.horizontal; 		//not implemented yet
							this.nrElements = this.options.nrElements; 		//nr of elements to display the values, must be an even number
							this.cursor = this.options.cursor;
							this.snap = this.options.snap;
							this.valueTransform = this.options.valueTransform;
							this.transformValue = this.options.transformValue;
							this.valueTranslate = this.options.valueTranslate;
							this.translateValue = this.options.translateValue;
						}

						if (Math.round( this.nrElements / 2 ) == this.nrElements / 2 )
						{
							throw "jQuery.spinTheWheel: nrElement must be an uneven numbered value";
						}


						this.value = this.defaultValue;
						this.speed = 0;
						this.isDown = false;
						this.lastSpinX = 0;
						this.startSpinX = 0;
						this.startSpinV = 0;
						this.intervalId = -1;
						this.mouseButtonIsDown = false;

						//remove all children
						this.obj.empty();

						//create the necessary elements
						for( var i=0; i< this.nrElements; i++ )
						{
							this.obj.append( "<div style='padding:0px,margin:0px;position:absolute;cursor:" + this.cursor + "'>" + i + "</div>" );
						}

						this.valueHolders = this.obj.children();
						this.obj.css( "cursor", this.cursor );

						if (this.horizontal)
							this.distanceBetweenValues = this.obj.width() / (this.nrElements-2);
						else
							this.distanceBetweenValues = this.obj.height() / (this.nrElements-2);

						this.resFactor = this.distanceBetweenValues / this.valueSpan;
					}
					
				this.calculateNearestValue = function( value )
				{
					return Math.round( this.value / this.valueSpan ) * this.valueSpan;
				};
						
				this.update = function()
				{
					//just if visible
					if ( this.obj.position() )
					{
						var nearestBelow = Math.floor( this.value / this.valueSpan ) * this.valueSpan;
						var diffValue = this.value - nearestBelow;
					
						if ( this.horizontal )
					 	{
							var center = this.obj.width() / 2;
			 				var startPos = this.obj.position().left;
							var posName = "left";
							var posValueHolder = this.valueHolders.eq(0).width()/2;
						}
						else
						{
							var center = this.obj.height() / 2;
							var startPos = this.obj.position().top;
							var posName = "top";
							var posValueHolder = this.valueHolders.eq(0).height()/2;
						}
					
						//calculate first xvalue
						var x0 = startPos + center - diffValue * this.resFactor;
					
						//Hide all before displaying those to be displayed
						this.valueHolders.css( "display" , "none" );
						this.valueHolders.eq( 0 ).html("" +  this.valueTranslate ( this.valueTransform( nearestBelow ) ) );
						this.valueHolders.eq( 0 ).css( posName, (x0 - posValueHolder ) + "px");
						this.valueHolders.eq( 0 ).css( "display" , "block" );
					
					//calculate positions below x0
					for(var n=1; n<= Math.floor(this.nrElements/2)-1; n++)
					{
						xn = x0 - n * this.distanceBetweenValues;
						v = nearestBelow - n * this.valueSpan;
						
						
						if (this.horizontal)
						{
							posValueHolder_n = this.valueHolders.eq(n).width() / 2;
						}
						else
						{
							posValueHolder_n = this.valueHolders.eq(n).height() / 2;
						}
							
						this.valueHolders.eq( n ).html("" +  this.valueTranslate ( this.valueTransform( v ) ) );
						this.valueHolders.eq( n ).css( posName, ( xn - posValueHolder_n  ) + "px" );
						
						if ( n == Math.floor(this.nrElements/2)-1  )
						{
							if (this.horizontal)
							 	cliprect = "rect(0px, " + (xn + this.valueHolders.eq(n).width()*1.5)  +"px, " + this.valueHolders.eq(n).height() + "px," + (Math.max(0, (startPos - xn) + posValueHolder_n ) )  + "px)"
							else
								cliprect = "rect(" + (Math.max(0, (startPos - xn) + this.valueHolders.eq(n).height()*0.5)) + "px, " + this.valueHolders.eq(n).width()  +"px, " + (xn + posValueHolder_n ) + "px,0px)"
							this.valueHolders.eq( n ).css( "clip", cliprect );
						}
						
						if ( this.valueTransform( v ) >= this.minValue )
						{
							this.valueHolders.eq( n ).css( "display" , "block" );	
						}
					}
					
					//calculate positions above
					for(n=Math.floor( this.nrElements / 2 )+1; n< this.nrElements; n++)
					{
						xn = x0 + ( n - Math.round( this.nrElements / 2 ) + 1 ) * this.distanceBetweenValues;
						v = nearestBelow + ( n - Math.round( this.nrElements / 2 ) + 1 ) * this.valueSpan;
						
						if (this.horizontal)
						{
							posValueHolder_n = this.valueHolders.eq(n).width() / 2;
						}
						else
						{
							posValueHolder_n = this.valueHolders.eq(n).height() / 2;
						}
						
						this.valueHolders.eq( n ).html("" +  this.valueTranslate ( this.valueTransform( v ) ) );
						this.valueHolders.eq( n ).css( posName, ( xn - posValueHolder_n ) + "px" );
						
						if ( n == this.nrElements - 1 )
						{
							if (this.horizontal)
								cliprect = "rect(0px," + Math.max(0,this.valueHolders.eq(n).width()*1.5 - Math.max(0, xn + this.valueHolders.eq(n).width() - (startPos+this.obj.width() )))  + "px, " + this.valueHolders.eq(n).height()  +"px, 0px)"
							else
								cliprect = "rect(0px, " + this.valueHolders.eq(n).width()  +"px, " + Math.max(0,this.valueHolders.eq(n).height()*1.5 - Math.max(0, xn + this.valueHolders.eq(n).height() - (startPos+this.obj.height() ))) + "px,0px)"
							this.valueHolders.eq( n ).css( "clip", cliprect );
						}
						
						if ( this.valueTransform( v ) <= this.valueTransform( this.maxValue ) )
						{
							this.valueHolders.eq(n).css("display","block");
						}
					}
				}
				};
				
				this.initialize();
				this.setValue( this.defaultValue );
			};
			
			jQuery.spinner.prototype.redraw = function( x )
			{
				this.update();
			};
			
			jQuery.spinner.prototype.spinTheWheel = function( x )
			{
				this.speed = x - this.lastSpinX;
				this.lastSpinX = x;
				
				var dx = ( x - this.startSpinX ) / this.resFactor;
				this.setValue( this.startSpinV - dx );
				
			};
			
			jQuery.spinner.prototype.setValue = function( v, overideSnap )
			{
				overideSnap = overideSnap || false;
				
				//enforce boundaries
				this.value = Math.min( this.transformValue( this.maxValue ), Math.max( this.transformValue( this.minValue ),   v  ) );
				
				
				if ( this.snap && !overideSnap)
					this.setValue( this.calculateNearestValue( this.value ), true );
				else
					this.update();
				
				
				if ( this.callback )
					this.callback( this.valueTranslate( this.valueTransform( Math.round( this.value ) ) ), Math.round( this.value ) );
			};
			
			jQuery.spinner.prototype.spinToValue = function( toValue )
			{
				if ( this.intervalId > -1 )
				{
					clearInterval( this.intervalId );
				}
				
				var spinner = this;
				
				this.intervalId = setInterval( function( ){
					diff = spinner.transformValue( spinner.toValue ) -  spinner.value ;
					spinner.speed = Math.max( 2, Math.abs( diff ) / 4) * ( diff ) / Math.abs( diff );
					spinner.setValue( spinner.value + spinner.speed / spinner.resFactor, true );
					if ( Math.abs( spinner.transformValue( spinner.toValue ) -  spinner.value  ) < 0.5 )
					{
						spinner.setValue( spinner.transformValue( spinner.toValue ) , true  );
						clearInterval( spinner.intervalId );
					}
				}, 10 );
			};
			
			jQuery.spinner.prototype.setOptions = function( newOptions )
			{
				var val = this.value;
					
				this.options = jQuery.extend( this.options, newOptions );
			this.initialize();
				this.setValue( val );				
			};